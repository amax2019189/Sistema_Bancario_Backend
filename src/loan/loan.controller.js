import Loan from './loan.model.js';
import Account from '../acounts/acount.model.js'
import User from '../users/user.model.js';

const MAX_LOAN_AMOUNT = 50000; 
const MAX_TERMS = 60;

export const createLoan = async (req, res) => {
    const { userDPI, userName, userLastName, amount, terms, withdrawal, account } = req.body;

    try {

        const user = await User.findById(req.user.uid)

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        //if (user.dpi !== userDPI || user.name !== userName || user.lastName !== userLastName) {
        //    return res.status(400).send("Datos del usuario incorrectos");
        //}

        // Convertir withdrawal a minúsculas
        const withdrawalLower = withdrawal.toLowerCase();

        // Validar que withdrawal solo sea "cuenta" o "caja"
        if (withdrawalLower !== 'cuenta' && withdrawalLower !== 'caja') {
            return res.status(400).send("El método de retiro debe ser 'cuenta' o 'caja'");
        }

        if (withdrawal === 'cuenta' && !account) {
            return res.status(400).send("El número de cuenta es requerido para retiro por cuenta");
        }

        // Check if account exists if withdrawal method is "cuenta"
        if (withdrawal === 'cuenta') {
            const existingAccount = await Account.findOne({ accountNumber: account });
            if (!existingAccount) {
                return res.status(404).send("Cuenta no encontrada");
            }

            // Check if the account belongs to the user
            if (existingAccount.userId.toString() !== user._id.toString()) {
                return res.status(403).send("Esta cuenta no te pertenece");
            }
        }

        if (amount > MAX_LOAN_AMOUNT) {
            return res.status(400).send(`El monto máximo del préstamo es ${MAX_LOAN_AMOUNT}`);
        }

        if (terms > MAX_TERMS) {
            return res.status(400).send(`El número máximo de cuotas es ${MAX_TERMS}`);
        }

        // Create a new loan
        const newLoan = new Loan({
            account,
            userDPI,
            userName,
            userLastName,
            amount,
            terms,
            withdrawal: withdrawalLower,
            installments: Array.from({ length: terms }, (_, i) => ({
                amount: amount / terms,
                dueDate: new Date(Date.now() + (i + 1) * 30 * 24 * 60 * 60 * 1000) // assuming monthly installments
            }))
        });

        await newLoan.save();

        res.status(201).send(newLoan);
    } catch (error) {
        console.error("Error al crear préstamo:", error.message);
        res.status(500).send("Error al crear préstamo");
    }
};

export const deleteLoan = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        // Verifica si el usuario que realiza la solicitud es el que solicitó el préstamo
        const user = await User.findById(req.user.uid);
        if (loan.userDPI !== user.dpi) {
            return res.status(403).send("No tienes permiso para eliminar este préstamo");
        }

        if (loan.state === "aprovada") {
            return res.status(400).send("No se puede eliminar un préstamo aprobado");
        }

        await loan.deleteOne();

        res.status(200).send("Préstamo cancelado exitosamente");
    } catch (error) {
        console.error("Error al eliminar préstamo:", error.message);
        res.status(500).send("Error al eliminar préstamo");
    }
};

export const getLoansapproved = async (req, res) => {
    const id = req.user.uid
    const user = await User.findById({ id })

    try {

        const approvedLoans = await Loan.find({ userDPI: user.dpi, state: "aprovada" });

        res.status(200).json({
            approvedLoans,
        });

    } catch (error) {

        console.error("Error al obtener préstamos:", error.message);
        res.status(500).send("Error al obtener préstamos");

    }
};

export const getLoanspending = async (req, res) => {
    const id = req.user.uid
    const user = await User.findById({ id })

    try {

        const pendingLoans = await Loan.find({ userDPI: user.dpi, state: "pendiente" });

        res.status(200).json({
            pendingLoans,
        });

    } catch (error) {

        console.error("Error al obtener préstamos:", error.message);
        res.status(500).send("Error al obtener préstamos");

    }
};

export const getLoansdenied = async (req, res) => {
    const id = req.user.uid
    const user = await User.findById({ id })

    try {

        const deniedLoans = await Loan.find({ userDPI: user.dpi, state: "denegada" });

        res.status(200).json({
            deniedLoans,
        });

    } catch (error) {

        console.error("Error al obtener préstamos:", error.message);
        res.status(500).send("Error al obtener préstamos");

    }
};

export const getLoanById = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findById(id);

        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        res.status(200).json(loan);
    } catch (error) {
        console.error("Error al obtener el préstamo:", error.message);
        res.status(500).send("Error al obtener el préstamo");
    }
};