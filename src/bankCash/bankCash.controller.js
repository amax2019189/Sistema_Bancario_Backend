import Caja from './caja.model.js';
import Loan from './loan.model.js';

export const withdrawLoan = async (req, res) => {
    const { withdrawCode, accountNumber } = req.body;

    try {
        const loan = await Loan.findOne({ withdrawCode });

        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        const transaction = new Caja({
            accountNumber,
            amount: loan.amount,
            loanId: loan._id,
            transactionType: 'withdrawal'
        });

        await transaction.save();

        res.status(200).json({
            msg: "Monto del préstamo retirado exitosamente",
            transaction
        });
    } catch (error) {
        console.error("Error al retirar monto del préstamo:", error.message);
        res.status(500).send("Error al retirar monto del préstamo");
    }
};