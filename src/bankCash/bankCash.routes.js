import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { payLoan, withdrawLoan } from './bankCash.controller.js';
import {approveLoan, getApprovedLoans, getNonApprovedLoans} from './gerenteBank.controller.js'

const router = Router();

router.post('/withdrawLoan', validarJWT, withdrawLoan);
router.post('/payloan', validarJWT, payLoan);
router.post('/approveLoan', validarJWT, approveLoan);
router.get('/getApproved', validarJWT, getApprovedLoans);
router.get('/getNonApproved', validarJWT, getNonApprovedLoans)

export default router;