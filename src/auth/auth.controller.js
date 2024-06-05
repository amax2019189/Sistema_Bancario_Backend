import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const register = async (req, res) => {
    try {
        const { email, username, password} = req.body;
        const encryptPassword = bcryptjs.hashSync(password);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: encryptPassword,
        });

        return res.status(200).json({
            msg: "|-- user has been added to database --|",
            userDetails: {
                user: user.username,
                password: user.password,
                email: user.email
            },
        });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Failed to register user");
    }
}

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

    const token = await generarJWT( user.id, user.email, user.username );

    res.status( 200 ).json( {
      msg: "Login Ok!!!",
      userDetails: {
        username: user.username,
        token: token,
      },
    } );

    } catch (e) {
        res.status(500).send("Comuniquese con el administrador");
    }
}