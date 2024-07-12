import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validateFields } from '../middlewares/validateFields.js';
import { deleteUser, updateUser, getUser, addFavorite, removeFavorite, updateFavoriteAlias } from "./user.controller.js";
const router = Router();

router.put(
    '/update/:id',
    [
        check( "email", "Este no es un correo válido" ).isEmail(),
        check( "lastname" ),
        check( "numbercel" ),
        check( "img" ),
        check( "name", "El username es obligatorio" ).not().isEmpty(),
        check( "password", "El password es obligatorio" ).not().isEmpty(),
        check( "password", "El password debe de ser mayor a 6 caracteres" ).isLength( {
            min: 6,
        } ),
        validarJWT,
        validateFields
    ],
    updateUser
)

router.delete(
    '/:id',
    [
        check( "id", "It is not a valid ID" ).isMongoId(),
        validarJWT,
        validateFields
    ],
    deleteUser
)

router.get(
    '/get/:id',
    [
        check( "id", "It is not a valid ID" ).isMongoId(),
        validarJWT,
        validateFields
    ],
    getUser
)

router.put(
    '/addFavorite/:id',
    [
        check( "id", "It is not a valid ID" ).isMongoId(),
        validarJWT,
        validateFields
    ],
    addFavorite
)

router.put(
    '/removeFavorite/:id',
    [
        check( "id", "It is not a valid ID" ).isMongoId(),
        validarJWT,
        validateFields
    ],
    removeFavorite
)

router.put(
    '/updateFavoriteAlias/:id',
    [
        check( "id", "It is not a valid ID" ).isMongoId(),
        validarJWT,
        validateFields
    ],
    updateFavoriteAlias
)



export default router;