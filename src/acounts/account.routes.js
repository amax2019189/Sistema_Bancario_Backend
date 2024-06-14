import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { createAccount, desactivateAccount, getAccountsUser } from "./account.controller.js";

const router = Router();

router.post(
    "/createAccount",
    [
        
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("lastname", "El apellido es obligatorio").not().isEmpty(),
        check("dpiNumber", "El dpi es obligatorio").not().isEmpty(),
        check("dpiNumber", "El dpi debe contener 13 caracteres").isLength({
        min: 13, max:13}),
        check("accountType", "El tipo de cuenta es obligatorio").not().isEmpty(),
        check("numberCel", "El numero telefonico es obligatorio").not().isEmpty(),
        validateFields,
        validarJWT,
    ],
createAccount,
)

router.get(
    "/myAccount",getAccountsUser
)

router.delete(
    "/deleteAccount/:cuentaId",
    [
        validarJWT,
        check("cuentaId", "Id no valido").isMongoId(),
        check("pasword", "El pasword es obligatorio").not().isEmpty(),
        check("dpi", "El dpi es obligatorio").not().isEmpty(),
        check("dpi", "El dpi debe contener 13 caracteres").isLength({
            min: 13, max:13}),
        validateFields,
    ],
    desactivateAccount
);

export default router;
