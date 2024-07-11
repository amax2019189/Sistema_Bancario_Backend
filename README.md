# Sistema_Bancario_Backend

https://blog-personal-backend-blush.vercel.app

export const getUserAccountsSummary = async (req, res) => {
    try {
        // Buscar el usuario autenticado por su email en el token
        const user = await User.findOne({ email: req.user.email }).populate('accounts');

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        // Obtener los detalles de las cuentas y los últimos 5 movimientos
        const accountDetails = await Promise.all(user.accounts.map(async (account) => {
            // Obtener los últimos 5 depósitos y transferencias para cada cuenta
            const deposits = await Deposit.find({ accountNumberDestino: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            const transfersSent = await Transfer.find({ accountNumberOrigen: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            const transfersReceived = await Transfer.find({ accountNumberDestino: account.accountNumber })
                .sort({ createdAt: -1 })
                .limit(5);

            // Combinar todos los movimientos y ordenar por fecha
            const movements = [...deposits, ...transfersSent, ...transfersReceived]
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 5); // Obtener solo los últimos 5 movimientos

            return {
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                accountBalance: account.accountBalance,
                movements
            };
        }));

        return res.status(200).json(accountDetails);

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error al obtener los detalles de las cuentas del usuario");
    }
};
