import express from 'express';
import { withdrawLoan } from './caja.controller.js';

const router = express.Router();

// Middleware to check for 'caja' role
const checkCajaRole = (req, res, next) => {
    if (req.user.roleUser !== 'caja') {
        return res.status(403).send("Su rol no tiene permiso para realizar esta acción");
    }
    next();
};

router.post('/caja/withdraw', checkCajaRole, withdrawLoan);

export default router;