import User from './user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const updateUser = async ( req, res ) => {
    try {
        const { id } = req.params;

        if ( req.user.uid !== id ) {
            return res.status( 403 ).json( { msg: 'No estás autorizado para actualizar este usuario' } );
        }

        const { _id, password, email, dpi, ...rest } = req.body;

        if ( password ) {
            const salt = bcryptjs.genSaltSync();
            rest.password = bcryptjs.hashSync( password, salt );
        }

        await User.findByIdAndUpdate( id, rest );

        res.status( 200 ).send( 'Tu cuenta ha sido actualizada' );

    } catch ( e ) {
        console.error( e );
        res.status( 500 ).send( 'Error en el servidor' );
    }
};

export const deleteUser = async ( req, res ) => {
    try {
        const { id } = req.params;

        if ( req.user.uid !== id ) {
            return res.status( 403 ).json( { msg: 'No estás autorizado para eliminar este usuario' } );
        }

        const user = await User.findByIdAndDelete( id );
        res.status( 200 ).send( 'El usuario ha sido eliminado exitosamente' );

    } catch ( e ) {
        console.error( e );
        res.status( 500 ).send( 'Contacta al administrador' );
    }
};

//get the user details, only the user which id corresponds with the token can see their credentials
export const getUser = async ( req, res ) => {
    try {
        const { id } = req.params;

        if ( req.user.uid !== id ) {
            return res.status( 403 ).json( { msg: 'No estás autorizado para ver este usuario' } );
        }

        const user = await User.findById( id );
        res.status( 200 ).json( user );

    } catch ( e ) {
        console.error( e );
        res.status( 500 ).send( 'Contacta al administrador' );
    }
};
