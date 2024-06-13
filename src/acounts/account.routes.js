import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validDpi } from "../helpers/db-validators.js";

const router = Router();

router.post(
    "/createAccount",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("apellido", "El apellido es obligatorio").not().isEmpty(),
        check("dpiNumber", "El dpi es obligatorio").not().isEmpty(),
        check("dpiNumber", "El dpi debe contener 13 caracteres").isLength({
        min: 13, max:13}),
        check("accountType", "El nombre es obligatorio").not().isEmpty(),
        check("name", "El nombre es obligatorio").not().isEmpty(),
    ]
)