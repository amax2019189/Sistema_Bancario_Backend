import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const register = async (req, res) => {
    try {
        const { email, username, password, roleUser} = req.body;
        const encryptPassword = bcryptjs.hashSync(password);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: encryptPassword,
            roleUser,
        });

        return res.status(200).json({
            msg: "|-- user has been added to database --|",
            userDetails: {
                user: user.username,
                password: user.password,
                email: user.email,
                roleUser,
            },
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to register user");
    }
}

/*
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email.toLowerCase() });

        if( !user){
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn´t exist in database`);
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if ( !validPassword ) {
            return res.status( 400 ).send( "wrong password" );
          }

    const token = await generarJWT( user.id, user.email, user.roleUser , user.username );

    res.status( 200 ).json( {
      msg: "Login Ok!!!",
      userDetails: {
        username: user.username,
        roleUser: user.roleUser,
        token: token,
      },
    } );

    } catch (e) {
        console.error('Error during login:', e);
        res.status(500).send("Comuniquese con el administrador");
    }
}
*/

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Received login request for email:', email); // Log inicial para verificar el email recibido

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log('User not found:', email); // Log para cuando el usuario no se encuentra
            return res.status(400).send(`Wrong credentials, ${email} doesn´t exist in database`);
        }

        if (!user.password) {
            console.log('User has no password:', user); // Log para cuando el usuario no tiene contraseña
            return res.status(500).send('User password is undefined');
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            console.log('Invalid password for user:', email); // Log para cuando la contraseña no es válida
            return res.status(400).send("Wrong password");
        }

        const token = await generarJWT(user.id, user.email, user.roleUser, user.username);

        console.log('Login successful for user:', email); // Log para cuando el login es exitoso

        res.status(200).json({
            msg: "Login Ok!!!",
            userDetails: {
                username: user.username,
                roleUser: user.roleUser,
                token: token,
            },
        });

    } catch (e) {
        console.error('Error during login:', e); // Log del error con más detalles
        res.status(500).send(`Comuniquese con el administrador. Error details: ${e.message}`);
    }
}