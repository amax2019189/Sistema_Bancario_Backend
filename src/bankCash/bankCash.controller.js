import Loan from '../loan/loan.model.js';
import User from '../users/user.model.js';
import Caja from './bankCash.model.js'

export const withdrawLoan = async (req, res) => {
    const { withdrawCode } = req.body;

    try {
        // Validate input
        if (!withdrawCode) {
            return res.status(400).send("El código de retiro es requerido");
        }

        // Find the loan
        const loan = await Loan.findOne({ withdrawCode });
        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        // Check if the loan is approved
        if (loan.state !== 'aprovada') {
            return res.status(400).send("El préstamo aún no está aprobado");
        }

        // Check if the withdrawal code has been used
        if (loan.withdrawCodeUsed = true) {
            return res.status(400).send("El código de retiro ya ha sido usado");
        }

        // Check if the withdrawal code matches
        if (loan.withdrawCode !== withdrawCode) {
            return res.status(400).send("Código de retiro incorrecto");
        }

        // Mark the withdrawal code as used
        loan.withdrawCodeUsed = true;
        await loan.save();

        const id = req.user.uid
        const user = await User.findById({id})
        // Record the transaction in Caja
        const newCajaTransaction = new Caja({
            user: user.dpi,
            accountNumber: loan.account,
            amount: loan.amount,
            loanId: loan._id,
            transactionType: 'withdrawal'
        });

        await newCajaTransaction.save();

        res.status(200).send("Monto del préstamo retirado exitosamente");
    } catch (error) {
        console.error("Error al retirar monto del préstamo:", error.message);
        res.status(500).send("Error al retirar monto del préstamo");
    }
};

export const payLoan = async (req, res) => {
    const { withdrawCode, amount } = req.body;

    try {
        // Validate input
        if (!withdrawCode || !amount) {
            return res.status(400).send("El ID del préstamo y el monto son requeridos");
        }

        // Find the loan
        const loan = await Loan.findById(withdrawCode);
        if (!loan) {
            return res.status(404).send("Préstamo no encontrado");
        }

        // Check if the loan is already fully paid
        const unpaidInstallments = loan.installments.filter(inst => !inst.paid);
        if (unpaidInstallments.length === 0) {
            return res.status(400).send("La deuda ya está saldada");
        }

        // Apply the payment to the next unpaid installment
        let remainingAmount = amount;
        for (let installment of unpaidInstallments) {
            if (remainingAmount <= 0) break;

            if (!installment.paid) {
                if (remainingAmount >= installment.amount) {
                    remainingAmount -= installment.amount;
                    installment.paid = true;
                } else {
                    // Partial payment for an installment (not fully handled in this example)
                    return res.status(400).send("El monto no cubre la cuota completa");
                }
            }
        }

        // Check if all installments are now paid
        const allPaid = loan.installments.every(inst => inst.paid);
        if (allPaid) {
            loan.state = 'saldada';
        }

        await loan.save();

        const id = req.user.uid
        const user = await User.findById({id})

        // Record the payment transaction in Caja
        const newCajaTransaction = new Caja({
            user: user.dpi,
            amount: amount,
            loanId: loan._id,
            transactionType: 'payment'
        });

        await newCajaTransaction.save();

        res.status(200).send("Pago del préstamo realizado exitosamente");
    } catch (error) {
        console.error("Error al realizar el pago del préstamo:", error.message);
        res.status(500).send("Error al realizar el pago del préstamo");
    }
};