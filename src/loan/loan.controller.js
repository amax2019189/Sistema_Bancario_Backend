import Loan from './loan.model.js';
import Account from '../acounts/acount.model.js'

export const createLoan = async (req, res) => {
    const { userDPI, userName, userLastName, amount, terms, withdrawal } = req.body;

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

        // Validar el tipo de withdrawal
        if (withdrawal === 'cuenta') {
            // Supongamos que el userDPI es único para cada cuenta de usuario
            const account = await Account.findOne({ userDPI });

            if (!account) {
                return res.status(404).json({ msg: 'Cuenta no encontrada' });
            }

            // Agregar el monto a la cuenta del usuario
            account.balance += amount;
            await account.save();
        } else {
            // Si no es 'cuenta', se asume que se retira en caja
            // Aquí podrías añadir lógica adicional si es necesario
        }

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