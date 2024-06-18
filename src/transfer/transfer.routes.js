import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { makeTransfer } from "./transfer.controller.js";

const router = Router();

router.post(
    "/makeTransfer",
    [
        check("amount", "El monto debe especificarlo").not().isEmpty(),
        validateFields,
        validarJWT       
    ],
    makeTransfer
)

export default router;