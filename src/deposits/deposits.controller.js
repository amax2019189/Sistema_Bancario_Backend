import mongoose from "mongoose";
import Deposit from './deposits.model.js';
import Account from '../acounts/acount.model.js';

const EXCHANGE_RATE = 7.75;

// Función para realizar un depósito
export const makeDeposit = async (req, res) => {
    const { accountNumberDestino, amount, description, exchangeRate } = req.body;

    try {
        if (req.user.roleUser !== 'gerente' && req.user.roleUser !== 'administrador' && req.user.roleUser !== 'caja') {
            return res.status(403).send("Su rol no puede realizar depositos");
        }

        // Fetch the account details to determine the account type
        const account = await Account.findOne({ accountNumber: accountNumberDestino });
        if (!account) {
            return res.status(404).send("Cuenta destino no encontrada");
        }

        let finalAmount = amount;

        // Perform currency conversion based on account type
        if (exchangeRate === "dolares") {
            if (account.accountType === "ahorro" || account.accountType === "monetaria") {
                finalAmount = amount * EXCHANGE_RATE; // Convert dollars to quetzales
            }
        } else if (exchangeRate === "quetzales") {
            if (account.accountType === "monetariaDolares" || account.accountType === "ahorroDolares") {
                finalAmount = amount / EXCHANGE_RATE; // Convert quetzales to dollars
            }
        }

        // Create the deposit
        const deposit = await Deposit.create({
            accountNumberDestino,
            amount: finalAmount,
            description,
            creatorDeposit: req.user.email,
            exchangeRate
        });

        // Update the account balance
        account.accountBalance += finalAmount;
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
        const deposit = await Deposit.findOne({ operationNumber });
        if (!deposit) {
            return res.status(404).send("Depósito no encontrado");
        }

        if (req.user.email !== deposit.creatorDeposit) {
            return res.status(403).send("No realizaste el depósito");
        }

        // Verificar si el depósito puede ser revertido (dentro de 1 minuto)
        const now = new Date();
        const depositTime = new Date(deposit.date).getTime();
        if (now.getTime() - depositTime > 2 * 60000) { // 2 * 60000 milisegundos = 2 minutos
            return res.status(403).send("Ya no se puede revertir este depósito");
        }

        // Revertir el depósito
        const account = await Account.findOne({ accountNumber: deposit.accountNumberDestino });
        if (!account) {
            return res.status(404).send("Cuenta destino no encontrada");
        }

        account.accountBalance -= deposit.amount;
        await account.save();

        // Eliminar el depósito usando deleteOne
        await Deposit.deleteOne({ _id: deposit._id });

        return res.status(200).json({
            msg: "Depósito revertido exitosamente",
            deposit
        });

    } catch (error) {
        console.error("Error al revertir depósito:" + error.message);
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