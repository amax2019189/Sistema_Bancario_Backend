import bcryptjs from 'bcryptjs';
import User from '../users/user.model.js';
import UserService from "../services/userService.model.js"
import Account from '../acounts/acount.model.js';
import { generarJWT } from '../helpers/generate-JWT.js';

export const register = async ( req, res ) => {
    try {
        const { email, name, lastname, password, roleUser, dpi, numbercel, img, address, namework, monthlyincome, birthdate, username, accountUse } = req.body;

        const encryptPassword = bcryptjs.hashSync( password );

        // Validar edad
        const birthdateDate = new Date( birthdate );
        const ageDifMs = Date.now() - birthdateDate.getTime();
        const ageDate = new Date( ageDifMs );
        const age = Math.abs( ageDate.getUTCFullYear() - 1970 );


        if ( age < 18 ) {
            return res.status( 400 ).json( { msg: "User must be at least 18 years old" } );
        }

        const user = await User.create( {
            name,
            lastname,
            dpi,
            numbercel,
            address,
            namwork: namework,
            monthlyincome,
            username,
            img,
            email: email.toLowerCase(),
            password: encryptPassword,
            roleUser,
            birthdate,
            accounts: []
        } );

        const account = await Account.create( {
            accountType: "monetaria", // O cualquier otro tipo predeterminado
            accountBalance: 0.00,
            state: "activa",
            accountUse, // Valor predeterminado válido
            user: user._id
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

    } catch ( e ) {
        console.log( e );
        return res.status( 500 ).send( "Failed to register user" );
    }
};

export const login = async ( req, res ) => {
    try {
        const { email, password } = req.body;

        console.log( 'Received login request for email:', email );

        // Try to find the user in both collections
        let user = await User.findOne( { email: email.toLowerCase() } ).populate( 'accounts' );
        if ( !user ) {
            user = await UserService.findOne( { email: email.toLowerCase() } ).populate( 'accounts' );
        }

        if ( !user ) {
            console.log( 'User not found:', email );
            return res.status( 400 ).send( `Wrong credentials, ${email} doesn´t exist in database` );
        }

        if ( !user.password ) {
            console.log( 'User has no password:', user );
            return res.status( 500 ).send( 'User password is undefined' );
        }

        const validPassword = bcryptjs.compareSync( password, user.password );

        if ( !validPassword ) {
            console.log( 'Invalid password for user:', email );
            return res.status( 400 ).send( "Wrong password" );
        }

        const token = await generarJWT( user.id, user.email, user.roleUser);

        console.log( 'Login successful for user:', email );

        res.status( 200 ).json( {
            msg: "Login Ok!!!",
            userDetails: {
                _id: user._id,
                name: user.name || user.companyName,
                lastname: user.lastname || "",
                email: user.email,
                numbercel: user.numbercel,
                address: user.address,
                birthdate: user.birthdate,
                roleUser: user.roleUser,
                accounts: user.accounts,
                token: token,
            },
            
            
        } );

        console.log(token)

    } catch ( e ) {
        console.error( 'Error during login:', e );
        res.status( 500 ).send( `Comuniquese con el administrador. Error details: ${e.message}` );
    }
};

