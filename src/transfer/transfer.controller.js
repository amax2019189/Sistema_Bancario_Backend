import { response, request } from "express";
import Transfer from "./transfer.model.js";
import User from "../users/user.model.js";
import Account from "../acounts/acount.model.js";

const EXCHANGE_RATE = 7.75;

export const makeTransfer = async (req, res) => {
    const { accountNumberOrigen, accountNumberDestino, amount, description, saveAsFavorite, alias } = req.body;

    try {

        const accountOrigen = await Account.findOne({ accountNumber: accountNumberOrigen });
        const accountDestino = await Account.findOne({ accountNumber: accountNumberDestino });

        if (!accountOrigen || !accountDestino) {
            return res.status(404).send("Cuenta origen o destino no encontrada");
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
            creatorTransfer: req.user.email ,
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

        // Agregar a favoritos si se especifica
        if (saveAsFavorite === true) {
            const user = await User.findById(req.user.uid);
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificar si el favorito ya existe para no duplicar
            const favoriteExists = user.favorites.some(fav => fav.accountNumber === accountNumberDestino);
            if (!favoriteExists) {
                user.favorites.push({ accountNumber: accountNumberDestino, alias });
                await user.save();
            }
        }

        return res.status(200).json({
            msg: "Transferencia realizada exitosamente",
            transfer
        });

    } catch (error) {
        console.error("Error al realizar transferencia:", error.message);
        return res.status(500).send("Error al realizar transferencia");
    }
};