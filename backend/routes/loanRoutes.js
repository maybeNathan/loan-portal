import express from 'express';
import {
  createLoanApplication,
  getMyLoans,
  getLoanById,
  updateLoanApplication,
  submitLoanApplication,
  getAllLoans,
  updateLoanStatus
} from '../controllers/loanController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createLoanApplication);
router.get('/my-loans', auth, getMyLoans);
router.get('/', auth, getAllLoans);
router.get('/:id', auth, getLoanById);
router.put('/:id', auth, updateLoanApplication);
router.post('/:id/submit', auth, submitLoanApplication);
router.put('/:id/status', auth, updateLoanStatus);

export default router;
