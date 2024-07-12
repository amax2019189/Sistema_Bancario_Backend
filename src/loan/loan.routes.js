import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { createLoan, deleteLoan, getLoanById, getLoansapproved, getLoansdenied, getLoanspending } from './loan.controller.js';
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    '/',
    [
        check("userDPI", "El dpi es obligatorio").not().isEmpty(),
        check("userName", "El nombre es obligatorio").not().isEmpty(),
        check("userLastName", "El apellido es obligatorio").not().isEmpty(),
        check("amount", "El monto es obligatorio").not().isEmpty(),
        check("terms", "Las cuotas son obligatorias").not().isEmpty(),
        check("withdrawal", "El destino es obligatorio").not().isEmpty(),
        validateFields,
        validarJWT,
    ], createLoan);


router.delete(
    '/cancel/:id',
    [
        check("id", "It is not a valid ID").isMongoId(),
        validateFields,
        validarJWT,
    ], deleteLoan);

router.get(
    '/approved',
    [
        validarJWT,
    ], getLoansapproved);

router.get(
    '/pending', 
    [
        validarJWT,
    ], getLoanspending);

router.get(
    '/denied', 
    [
        validarJWT,
    ], getLoansdenied);

router.get(
    '/:id', 
    [
        check("id", "It is not a valid ID").isMongoId(),
        validateFields,
        validarJWT,
    ], getLoanById);

export default router;