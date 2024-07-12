import User from './user.model.js';
import Account from '../acounts/acount.model.js';
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
        res.status( 200 ).send( 'El usuario ha sido eliminado exitosamente', user );

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

// Agregar cuenta como favorita
export const addFavorite = async ( req, res ) => {
    const userId = req.userId;
    const { accountNumber, alias } = req.body;

    try {
        const user = await User.findById( userId );
        if ( !user ) {
            return res.status( 404 ).json( { msg: 'Usuario no encontrado' } );
        }

        //check if account number corresponds to existing account
        const account = await Account.findOne( { accountNumber } );
        if ( !account ) {
            return res.status( 404 ).json( { msg: 'Cuenta no encontrada' } );
        }


        const existingFavorite = user.favorites.find( favNum => favNum.accountNumber === accountNumber );
        if ( existingFavorite ) {
            return res.status( 400 ).json( { msg: 'La cuenta ya está en la lista de favoritos' } );
        }

        user.favorites.push( { accountNumber, alias } );
        await user.save();

        res.status( 200 ).json( { msg: 'Cuenta agregada a favoritos', favorites: user.favorites } );
    } catch ( error ) {
        res.status( 500 ).json( { msg: 'Error al agregar cuenta a favoritos', error } );
    }
};

// Eliminar cuenta favorita
export const removeFavorite = async ( req, res ) => {
    const userId = req.userId;
    const { accountNumber } = req.params;

    try {
        const user = await User.findById( userId );
        if ( !user ) {
            return res.status( 404 ).json( { msg: 'Usuario no encontrado' } );
        }
        //check if account number corresponds to existing account
        const account = await Account.findOne( { accountNumber } );
        if ( !account ) {
            return res.status( 404 ).json( { msg: 'Cuenta no encontrada' } );
        }

        user.favorites = user.favorites.filter( fav => fav.accountNumber !== accountNumber );
        await user.save();

        res.status( 200 ).json( { msg: 'Cuenta eliminada de favoritos', favorites: user.favorites } );
    } catch ( error ) {
        res.status( 500 ).json( { msg: 'Error al eliminar cuenta de favoritos', error } );
    }
};

// Actualizar alias de cuenta favorita
export const updateFavoriteAlias = async ( req, res ) => {
    const userId = req.userId;
    const { accountNumber } = req.params;
    const { alias } = req.body;

    try {
        const user = await User.findById( userId );
        if ( !user ) {
            return res.status( 404 ).json( { msg: 'Usuario no encontrado' } );
        }

        //checks if account number corresponds to existing account
        const account = await Account.findOne( { accountNumber } );
        if ( !account ) {
            return res.status( 404 ).json( { msg: 'Cuenta no encontrada' } );
        }

        const favorite = user.favorites.find( fav => fav.accountNumber === accountNumber );
        if ( !favorite ) {
            return res.status( 404 ).json( { msg: 'Cuenta no encontrada en favoritos' } );
        }

        favorite.alias = alias;
        await user.save();

        res.status( 200 ).json( { msg: 'Alias de cuenta favorita actualizado', favorites: user.favorites } );
    } catch ( error ) {
        res.status( 500 ).json( { msg: 'Error al actualizar alias de cuenta favorita', error } );
    }
};

