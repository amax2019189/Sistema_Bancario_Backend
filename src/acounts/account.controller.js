import bcryptjs from 'bcryptjs';
import Account from "./acount.model.js";
import User from "../users/user.model.js";
import {validDpi, validType} from "../helpers/db-validators.js"

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