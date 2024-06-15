import mongoose from "mongoose";
import Deposit from './deposits.model.js';
import Account from '../acounts/acount.model.js';

export const makeDeposit = async (req, res) => {
    const { accountNumberDestino, amount, description } = req.body;

    try {

        if (req.user.roleUser !== 'gerente' && req.user.roleUser !== 'administrador' && req.user.roleUser !== 'caja') {
            return res.status(403).send("Su rol no puede realizar depositos");
        }

        // Crear el depósito
        const deposit = await Deposit.create({
            accountNumberDestino,
            amount,
            description,
            creatorDeposit: req.user.email
        });

        // Actualizar el saldo de la cuenta destinataria
        const account = await Account.findOne({ accountNumber: accountNumberDestino });
        if (!account) {
            return res.status(404).send("Cuenta destino no encontrada");
        }

        account.accountBalance += amount;
        await account.save();

        return res.status(200).json({
            msg: "Depósito realizado exitosamente",
            deposit
        });

    } catch (error) {
        console.error("Error al realizar depósito:", error.message);
        return res.status(500).send("Error al realizar depósito");
    }
};

// Función para revertir un depósito
export const reverseDeposit = async (req, res) => {
    const { operationNumber } = req.body;

    try {

        const deposit = await Deposit.findOne(operationNumber);
        if (!deposit) {
            return res.status(404).send("Depósito no encontrado");
        }

        if (req.user.email !== deposit.creatorDeposit) {
            return res.status(404).send("No realizaste el deposito");
        }

        // Verificar si el depósito puede ser revertido (dentro de 1 minuto)
        const now = new Date();
        const depositTime = deposit.date.getTime();
        if (now - depositTime > 60000) { // 60000 milisegundos = 1 minuto
            return res.status(403).send("Ya no se puede revertir este depósito");
        }

        // Revertir el depósito
        const account = await Account.findOne({ accountNumber: deposit.accountNumberDestino });
        if (!account) {
            return res.status(404).send("Cuenta destino no encontrada");
        }

        account.accountBalance -= deposit.amount;
        await account.save();

        await deposit.remove();

        return res.status(200).json({
            msg: "Depósito revertido exitosamente",
            deposit
        });

    } catch (error) {
        console.error("Error al revertir depósito:", error.message);
        return res.status(500).send("Error al revertir depósito");
    }
};

// Función para editar un depósito
export const editDeposit = async (req, res) => {
    const { operationNumber, amount, description } = req.body;

    try {

        // Buscar el depósito por su ID
        const deposit = await Deposit.findOne(operationNumber);
        if (!deposit) {
            return res.status(404).send("Depósito no encontrado");
        }

        if (req.user.email !== deposit.creatorDeposit) {
            return res.status(404).send("No realizaste el deposito");
        }

        // Actualizar los campos del depósito si es necesario
        if (amount) {
            deposit.amount = amount;
        }
        if (description) {
            deposit.description = description;
        }

        // Guardar el depósito actualizado
        await deposit.save();

        return res.status(200).json({
            msg: "Depósito actualizado exitosamente",
            deposit
        });

    } catch (error) {
        console.error("Error al editar depósito:", error.message);
        return res.status(500).send("Error al editar depósito");
    }
};