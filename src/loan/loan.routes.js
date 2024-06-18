import express from 'express';
import { createLoan } from './loan.controller.js';

const router = express.Router();

router.post('/loans', createLoan);

export default router;