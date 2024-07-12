import bcryptjs from 'bcryptjs';
import Account from "./acount.model.js";
import Deposit from '../deposits/deposits.model.js'
import Transfer from '../transfer/transfer.model.js'
import User from "../users/user.model.js";
import {validDpi, validType} from "../helpers/db-validators.js"
import jwt from 'jsonwebtoken'

const TOKEN_KEY = '$i$tem@B@nc@ri0_bim3';

export const createAccount = async(req, res) => {
    try {
        const {dpiNumber, accountType} = req.body;
        const user = await User.findOne({dpi:dpiNumber});
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (req.user.roleUser !== 'gerente' && req.user.roleUser !== 'administrador') {
            return res.status(403).send("Su rol no puede crear cuentas");
        }

        // Validar DPI
        await validDpi(dpiNumber);

        // Validar tipo de cuenta
        await validType(accountType);
        
        const account = new Account({accountType});
        await account.save();

        user.accounts.push(account._id);
        await user.save();

        return res
        .status(200)
        .send(`cuenta creada exitosamente`);

    } catch (e) {
        console.log(e);
        return res
        .status(403)
        .send(`contacta al administrador`+"error en account");
    };
};
export const getAccountsUser = async (req, res) => {
    try {
        const { uid } = req.user;
        const userWithAccounts = await User.findById(uid).populate('accounts');

        if (!userWithAccounts) {
            return res.status(404).send("Usuario no encontrado");
        }

        return res.status(200).json(userWithAccounts);

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error al obtener las cuentas del usuario");
    }
};
    
export const desactivateAccount = async (req, res) => {
    try {
        const { noAccount, dpi } = req.body;

        if (req.user.roleUser !== 'gerente' && req.user.roleUser !== 'administrador') {
            return res.status(403).send("Su rol no puede desactivar cuentas");
        }

        const user = await User.findOne({ dpi: dpi }).populate('accounts');  // Buscar al usuario por DPI y cargar sus cuentas

        if (!user) {
            return res.status(404).send("No se encontró el usuario");
        }

        // Verificar si la cuenta pertenece al usuario encontrado
        const account = user.accounts.find(acc => acc.accountNumber === noAccount);

        if (!account) {
            return res.status(404).send("No se encontró la cuenta para este usuario");
        }

        // Desactivar la cuenta
        account.state = 'desactivada';
        await account.save();

        return res.status(200).send(`Cuenta desactivada exitosamente`);

    } catch (e) {
        console.log(e);
        return res.status(500).send(`Error al desactivar la cuenta`);
    }
};

export const activateAccount = async (req, res) => {
    try {
        const { noAccount, dpi } = req.body;

        if (req.user.roleUser !== 'gerente' && req.user.roleUser !== 'administrador') {
            return res.status(403).send("Su rol no puede activar cuentas");
        }

        const user = await User.findOne({ dpi: dpi }).populate('accounts');  // Buscar al usuario por DPI y cargar sus cuentas

        if (!user) {
            return res.status(404).send("No se encontró el usuario");
        }

        // Verificar si la cuenta pertenece al usuario encontrado
        const account = user.accounts.find(acc => acc.accountNumber === noAccount);

        if (!account) {
            return res.status(404).send("No se encontró la cuenta para este usuario");
        }

        // Activar la cuenta
        account.state = 'activa';
        await account.save();

        return res.status(200).send(`Cuenta activada exitosamente`);

    } catch (e) {
        console.log(e);
        return res.status(500).send(`Error al activar la cuenta`);
    }
};


export const getUserAccountsDetailsByEmail = async (req, res) => {
    try {

        const user = await User.findOne({ email:req.user.email }).populate('accounts');

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const accountDetails = await Promise.all(user.accounts.map(async (account) => {
            const deposits = await Deposit.find({ accountNumberDestino: account.accountNumber });
            const transfersSent = await Transfer.find({ accountNumberOrigen: account.accountNumber });
            const transfersReceived = await Transfer.find({ accountNumberDestino: account.accountNumber });

            return {
                accountNumber: account.accountNumber,
                balance: account.accountBalance,
                deposits,
                transfersSent,
                transfersReceived
            };
        }));

        return res.status(200).json(accountDetails);

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error al obtener los detalles de las cuentas del usuario");
    }
};

export const getAccountDetailsByIdForUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el usuario por email
        const user = await User.findOne({ email: req.user.email }).populate('accounts');

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Buscar la cuenta específica por ID
        const account = await Account.findById(id);

        if (!account) {
            return res.status(404).send("Cuenta no encontrada");
        }

        // Verificar si la cuenta pertenece al usuario
        const userAccount = user.accounts.find(acc => acc._id.toString() === id);

        if (!userAccount) {
            return res.status(403).send("La cuenta no pertenece al usuario autenticado");
        }

        // Obtener todos los movimientos asociados a la cuenta
        const deposits = await Deposit.find({ accountNumberDestino: account.accountNumber });
        const transfersSent = await Transfer.find({ accountNumberOrigen: account.accountNumber });
        const transfersReceived = await Transfer.find({ accountNumberDestino: account.accountNumber });

        return res.status(200).json({
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            balance: account.accountBalance,
            state: account.state,
            deposits,
            transfersSent,
            transfersReceived
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error al obtener los detalles de la cuenta");
    }
};
/*
export const accountbalance = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ message: 'Token no proporcionado' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: 'Token no proporcionado' });
        }

        let decoded;

        try {
            decoded = jwt.verify(token, TOKEN_KEY);
        } catch (e) {
            console.log('Error al verificar el token:', e);
            return res.status(401).send({ message: 'Token inválido' });
        }

        console.log('Decoded token:', decoded);
        
        const userId = decoded.uid;
        if (!userId) {
            return res.status(401).send({ message: 'Token inválido' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const account = await Account.findOne({ userId: user._uid });
        if (!account) {
            return res.status(404).send({ message: 'Cuenta no encontrada' });
        }

        res.status(200).json({ saldo: account.accountBalance });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Comuníquese con el administrador, no cuenta con saldo.");
    }
};
*/

export const getUserAccountsSummary = async (req, res) => {
    try {
        // Buscar el usuario autenticado por su email en el token
        const user = await User.findOne({ email: req.user.email }).populate('accounts');

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Obtener los detalles de las cuentas y los últimos 5 movimientos
        const accountDetails = await Promise.all(user.accounts.map(async (account) => {
            // Obtener los últimos 5 depósitos y transferencias para cada cuenta
            const deposits = await Deposit.find({ accountNumberDestino: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            const transfersSent = await Transfer.find({ accountNumberOrigen: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            const transfersReceived = await Transfer.find({ accountNumberDestino: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            // Combinar todos los movimientos y ordenar por fecha
            const movements = [...deposits, ...transfersSent, ...transfersReceived]
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5); // Obtener solo los últimos 5 movimientos

            return {
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                accountBalance: account.accountBalance,
                movements
            };
        }));

        return res.status(200).json(accountDetails);

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error al obtener los detalles de las cuentas del usuario");
    }
};