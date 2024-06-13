import Account from "./acount.model.js";
import User from "../users/user.model.js";

export const createAccount = async(req, res) => {
    try {
        const {uid} = req.user;
        const user = await User.findById(uid);

        const {name, lastname, dpiNumber, accountType, numberCel } = req.body
        const account = new Account({name, lastname, dpiNumber, accountType, numberCel});
        await account.save();

        user.acounts.push(account._id);
        await user.save();

        return res
        .status(200)
        .send(`cuenta creada exitosamente`);

    } catch (e) {
        console.log(e);
        return res
        .status(403)
        .send(`contacta al administrador`+"error en account");
    };
};

export const getAccountsUser = async (req,res) => {
    try {
        const {uid} = req.user;
        const myAccount = await User.findById(uid).populate('accounts');
        res.status(200).json(myAccount)
    } catch (e) {
        console.log(e);
        return res
        .status(403)
        .send(`no se pudieron encontrar las cuentas`);
    }
}

export const desactivateAccount = async (req, res) =>{
    try {
        const{cuentaId} = req.params;
        const {uid} = req.user;
        const {pasword, dpi } = req.body;

        const user = await User.findById(uid).populate('accounts');
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        const account = user.accounts.find(account => account._id.toString() === cuentaId);
        if (!account) {
            return res.status(404).send("Cuenta no encontrada");
        }

        const validPassword = bcryptjs.compareSync(pasword, user.password);

        if ( !validPassword ) {
            return res.status( 400 ).send( ":( contraseña incorrecta" );
        }

        if (account.alias !== alias) {
            return res.status(400).send("Alias no coinciden con la cuenta");
        }

        if (account.dpiNumber !== dpi) {
            return res.status(400).send("DPI no coinciden con la cuenta");
        }

        // Desactivar la cuenta
        account.state = 'desactivada';
        await account.save();

        return res
        .status(200)
        .send(`cuenta desactivada exitosamente`);

    } catch (error) {
        console.log(e);
        return res
        .status(403)
        .send(`no se pudieron encontrar las cuentas`);
    }
}