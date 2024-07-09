import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { payService, getPaidServices } from "./service.controller.js"

const router = Router();

router.post(
    "/pay-service",
    [
        validarJWT,
        check("accountNumberOrigen", "El número de cuenta origen es obligatorio").not().isEmpty(),
        check("accountNumberDestino", "El número de cuenta destino es obligatorio").not().isEmpty(),
        check("amount", "El monto es obligatorio").isNumeric(),
        check("serviceType", "El tipo de servicio es obligatorio").not().isEmpty(),
        validateFields,
    ],
    payService
);

router.get(
    "/paid-services",
    validarJWT,
    getPaidServices
);

export default router;