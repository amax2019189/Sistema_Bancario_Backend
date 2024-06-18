import Loan from './loan.model.js';

export const createLoan = async (req, res) => {
    const { userDPI, userName, userLastName, amount, terms } = req.body;

    try {
        const installmentAmount = amount / terms;
        const installments = [];

        for (let i = 1; i <= terms; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i);

            installments.push({
                amount: installmentAmount,
                dueDate
            });
        }

        const loan = new Loan({
            userDPI,
            userName,
            userLastName,
            amount,
            terms,
            installments
        });

        await loan.save();

        res.status(201).json({
            msg: "Préstamo creado exitosamente",
            loan
        });
    } catch (error) {
        console.error("Error al crear préstamo:", error.message);
        res.status(500).send("Error al crear préstamo");
    }
};