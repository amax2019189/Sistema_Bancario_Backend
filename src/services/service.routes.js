import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { payService, getPaidServices, registerService } from "./service.controller.js"

const router = Router();

router.post(
    "/pay",
    [
        validarJWT,
        check("accountNumberOrigen", "El número de cuenta origen es obligatorio").not().isEmpty(),
        check("accountNumberDestino", "El número de cuenta destino es obligatorio").not().isEmpty(),
        check("amount", "El monto es obligatorio").isNumeric(),
        check("service", "El tipo de servicio es obligatorio").not().isEmpty(),
        validateFields,
    ],
    payService
);

router.get(
    "/paid",
    validarJWT,
    getPaidServices
);

router.post(
    "/register",
    [
        check("email", "El correo es obligatorio y debe ser válido").isEmail(),
        check("companyCode", "El código de la empresa es obligatorio").not().isEmpty(),
        check("accountType", "El accountType es obligatorio").not().isEmpty(),
        check("companyName", "El nombre de la empresa es obligatorio").not().isEmpty(),
        check("username", "El nombre de usuario es obligatorio").not().isEmpty(),
        check("numbercel", "El número de celular es obligatorio y debe ser un número").isNumeric(),
        check("address", "La dirección es obligatoria").not().isEmpty(),
        check("namwork", "El nombre del trabajo es obligatorio").not().isEmpty(),
        check("password", "La contraseña es obligatoria y debe tener mínimo 6 caracteres").isLength({ min: 6 }),
        check("monthlyincome", "El ingreso mensual es obligatorio y debe ser un número").isNumeric(),
        validateFields,
    ],
    registerService
);

export default router;