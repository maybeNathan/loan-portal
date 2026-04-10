import express from 'express';
import {
  uploadDocument,
  getDocuments,
  verifyDocument,
  deleteDocument
} from '../controllers/documentController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, ...uploadDocument);
router.get('/', auth, getDocuments);
router.put('/:id/verify', auth, verifyDocument);
router.delete('/:id', auth, deleteDocument);

export default router;
