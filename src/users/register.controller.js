import User from '../users/user.model.js';
import Account from '../acounts/acount.model.js';

export const registerAdmin = async (req, res) => {
    try {
        const { email, name, lastname, password, roleUser, dpi, numbercel, img } = req.body;
        const encryptPassword = bcryptjs.hashSync( password );

        const user = await User.create({
            name,
            lastname,
            dpi,
            numbercel,
            img,
            email: email.toLowerCase(),
            password: encryptPassword,
            roleUser,
            accounts: []
        });

        const account = await Account.create( {
            accountType: "monetaria",
            accountBalance: 0.00,
            state: "activa"
        } );

        user.accounts.push( account._id );
        await user.save();

        return res.status( 200 ).json( {
            msg: "|-- user has been added to database --|",
            userDetails: {
                user: user.name,
                email: user.email,
                roleUser: user.roleUser,
            },
        } );
        // Aqui se creo una validaciòn especial para que se pueda cambiar el rol de admin y caja

    } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to register user");
    }
}