import { response, request } from "express";
import User from "../users/user.model.js";
import Account from "../acounts/acount.model.js";
import Service from "./service.model.js";
import Transfer from "../transfer/transfer.model.js"
import UserService from "./userService.model.js"
import bcryptjs from 'bcryptjs';

const EXCHANGE_RATE = 7.5; // Define a constant exchange rate

export const payService = async (req, res) => {
    const { accountNumberOrigen, accountNumberDestino, amount, description, serviceType } = req.body;

    try {
        const accountOrigen = await Account.findOne({ accountNumber: accountNumberOrigen });
        const accountDestino = await Account.findOne({ accountNumber: accountNumberDestino });

        if (!accountOrigen || !accountDestino) {
            return res.status(404).send("Cuenta origen o destino no encontrada");
        }

        // Verificar si la cuenta origen pertenece al usuario
        const user = await User.findById(req.user.uid);
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Verificar si la cuenta origen está en la lista de cuentas del usuario
        const isAccountOwnedByUser = user.accounts.some(accountId => accountId.equals(accountOrigen._id));
        if (!isAccountOwnedByUser) {
            return res.status(403).send("No eres propietario de la cuenta origen");
        }

        // Verificar que el accountUse de la cuenta destino sea "Business"
        if (accountDestino.accountUse !== 'Business') {
            return res.status(400).send("La cuenta destino debe ser de uso 'Business'");
        }

        if (amount > 2000) {
            return res.status(400).send("No se puede transferir más de Q2000 en una sola transacción");
        }

        let finalAmount = amount;

        const origenEsQuetzales = accountOrigen.accountType === 'monetaria' || accountOrigen.accountType === 'ahorro';
        const destinoEsDolares = accountDestino.accountType === 'monetariaDolares' || accountDestino.accountType === 'ahorroDolares';
        const origenEsDolares = accountOrigen.accountType === 'monetariaDolares' || accountOrigen.accountType === 'ahorroDolares';
        const destinoEsQuetzales = accountDestino.accountType === 'monetaria' || accountDestino.accountType === 'ahorro';

        if (origenEsQuetzales && destinoEsDolares) {
            finalAmount = amount / EXCHANGE_RATE;
        } else if (origenEsDolares && destinoEsQuetzales) {
            finalAmount = amount * EXCHANGE_RATE;
        }

        // Validar que el saldo de la cuenta origen sea suficiente
        if (accountOrigen.accountBalance < amount) {
            return res.status(400).send("Saldo insuficiente" + finalAmount);
        }

        // Validar que el usuario no exceda el límite de transferencia diaria
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const transfersToday = await Transfer.find({
            creatorTransfer: req.user.email,
            date: { $gte: today }
        });

        const totalTransferredToday = transfersToday.reduce((total, transfer) => total + transfer.amount, 0);

        if (totalTransferredToday + amount > 10000) {
            return res.status(400).send("No se puede transferir más de Q10000 en un solo día");
        }

        accountOrigen.accountBalance -= amount;
        accountDestino.accountBalance += finalAmount;

        await accountOrigen.save();
        await accountDestino.save();

        const transfer = await Transfer.create({
            accountNumberOrigen,
            accountNumberDestino,
            amount: finalAmount,
            description,
            creatorTransfer: req.user.email
        });

        // Registrar el servicio
        const service = new Service({
            service: serviceType,
            noAccount: accountNumberDestino,
            amount,
            description,
            user: {
                name: user.name,
                lastname: user.lastname,
                dpi: user.dpi
            },
            dateService: new Date()
        });
        await service.save();

        return res.status(200).json({
            msg: "Transferencia y pago de servicio realizados exitosamente",
            transfer,
            service
        });

    } catch (error) {
        console.error("Error al realizar transferencia:", error.message);
        return res.status(500).send("Error al realizar transferencia");
    }
};

export const getPaidServices = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);
        
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const services = await Service.find({ "user.dpi": user.dpi });

        if (!services.length) {
            return res.status(404).json({ msg: "No se encontraron servicios pagados" });
        }

        return res.status(200).json({ msg: "Servicios pagados encontrados", services });
    } catch (error) {
        console.error("Error al obtener los servicios pagados:", error.message);
        return res.status(500).send("Error al obtener los servicios pagados");
    }
};

export const registerService = async (req, res) => {
    try {
        const { email, companyCode, companyName, username, numbercel, address, namwork, password, roleUser, monthlyincome, img, accountType } = req.body;
        const encryptPassword = bcryptjs.hashSync(password);

        const user = await UserService.create({
            companyName,
            dpi: companyCode,
            numbercel,
            img,
            address,
            namwork,
            monthlyincome,
            username,
            email: email.toLowerCase(),
            password: encryptPassword,
            roleUser,
            accounts: []
        });

        const account = await Account.create({
            accountType,
            accountBalance: 0.00,
            state: "activa",
            accountUse: "Business",
            user: user._id
        });

        user.accounts.push(account._id);
        await user.save();

        return res.status(200).json({
            msg: "|-- user has been added to database --|",
            userDetails: {
                user: user.companyName,
                email: user.email,
                roleUser: user.roleUser,
            },
        });
        // Aqui se creo una validaciòn especial para que se pueda cambiar el rol de admin y caja

    } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to register user");
    }
}

