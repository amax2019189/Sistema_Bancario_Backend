import Loan from './loan.model.js';
import Account from '../acounts/acount.model.js';

export const approveLoan = async (req, res) => {
    const { withdrawCode } = req.body;

    try {
        // Validate input
        if (!withdrawCode) {
            return res.status(400).send("El withdrawCode del préstamo es requerido");
        }

        if (req.user.roleUser !== "gerente" && req.user.roleUser !== "administrador") {
            return res.status(400).send("El rol no es válido para esta operación");
        }

        // Find the loan
        const loan = await Loan.findOne(withdrawCode);
        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        // Update the loan state to approved
        loan.state = 'aprovada';
        await loan.save();

        // If withdrawal method is "cuenta", add the loan amount to the account balance
        if (loan.withdrawal === 'cuenta') {
            const account = await Account.findOne({ accountNumber: loan.account });
            if (account) {
                account.balance += loan.amount;
                await account.save();
            }
        }

        res.status(200).send("Préstamo aprobado exitosamente");
    } catch (error) {
        console.error("Error al aprobar el préstamo:", error.message);
        res.status(500).send("Error al aprobar el préstamo");
    }
};

export const getApprovedLoans = async (req, res) => {
    try {
        if (req.user.roleUser !== "gerente" && req.user.roleUser !== "administrador") {
            return res.status(400).send("El rol no es válido para esta operación");
        }

        const approvedLoans = await Loan.find({ state: 'aprovada' });
        res.status(200).json(approvedLoans);
    } catch (error) {
        console.error("Error al obtener los préstamos aprobados:", error.message);
        res.status(500).send("Error al obtener los préstamos aprobados");
    }
};

export const getNonApprovedLoans = async (req, res) => {
    try {
        if (req.user.roleUser !== "gerente" && req.user.roleUser !== "administrador") {
            return res.status(400).send("El rol no es válido para esta operación");
        }

        const nonApprovedLoans = await Loan.find({ state: { $ne: 'aprovada' } });
        res.status(200).json(nonApprovedLoans);
    } catch (error) {
        console.error("Error al obtener los préstamos no aprobados:", error.message);
        res.status(500).send("Error al obtener los préstamos no aprobados");
    }
};