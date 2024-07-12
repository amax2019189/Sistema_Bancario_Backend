import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { 
    activateAccount, 
    createAccount,
    desactivateAccount, 
    getAccountsUser, 
    getUserAccountsDetailsByEmail, 
    getAccountDetailsByIdForUser,
    getUserAccountsSummary
} from "./account.controller.js";

const router = Router();

router.post(
    "/createAccount",
    [
        check("dpiNumber", "El dpi es obligatorio").not().isEmpty(),
        check("dpiNumber", "El dpi debe contener 13 caracteres").isLength({
        min: 13, max:13}),
        check("accountType", "El tipo de cuenta es obligatorio").not().isEmpty(),
        validateFields,
        validarJWT,
    ],
createAccount,
)

router.get(
    "/myAccount",validarJWT,getAccountsUser
)

router.delete(
    "/deleteAccount",
    [
        validarJWT,
        check("noAccount", "El Numero de cuenta es obligatorio").not().isEmpty(),
        check("dpi", "El dpi es obligatorio").not().isEmpty(),
        check("dpi", "El dpi debe contener 13 caracteres").isLength({
            min: 13, max:13}),
        validateFields,
    ],
    desactivateAccount
);

router.put(
    "/activateAccount",
    [
        validarJWT,
        check("noAccount", "El Numero de cuenta es obligatorio").not().isEmpty(),
        check("dpi", "El dpi es obligatorio").not().isEmpty(),
        check("dpi", "El dpi debe contener 13 caracteres").isLength({
            min: 13, max:13}),
        validateFields,
    ],
    activateAccount
);

router.get('/user/accounts', validarJWT, getUserAccountsDetailsByEmail);
router.get('/:id', validarJWT, getAccountDetailsByIdForUser);
router.get('/account/saldo', validarJWT, getUserAccountsSummary);

export default router;