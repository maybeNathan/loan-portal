import express from 'express';
import {
  calculateLoanAmount,
  calculateProjectMetrics,
  calculateARV,
  calculatePaymentSchedule
} from '../controllers/calculatorController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/loan-amount', auth, calculateLoanAmount);
router.post('/project-metrics', auth, calculateProjectMetrics);
router.post('/arv', auth, calculateARV);
router.post('/payment-schedule', auth, calculatePaymentSchedule);

export default router;
