import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { reverseDeposit, makeDeposit, editDeposit } from "./deposits.controller.js";

const router = Router();

router.post(
    "/makeDeposit",
    [
        check("accountNumberDestino", "La cuenta destino es obligatoria").not().isEmpty(),
        check("amount", "El monto es obligatorio").not().isEmpty(),
        check("exchangeRate", "El tipo de cambio es obligatorio").not().isEmpty(),
        validateFields,
        validarJWT,
    ],
    makeDeposit
) 

router.delete(
    "/reverseDeposit",
    [
        check("operationNumber", "El numero del deposito es necesario").not().isEmpty(),
        validateFields,
        validarJWT,
    ],
    reverseDeposit
)

router.put(
    "/editDeposit",
    [
        check("operationNumber", "El numero del deposito es necesario").not().isEmpty(),
        validateFields,
        validarJWT,
    ],
    editDeposit
)

export default router;
