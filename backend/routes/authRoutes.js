import express from 'express';
import {
  register,
  login,
  setupTFA,
  enableTFAEndpoint,
  getUserProfile,
  updateUserProfile
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setup-tfa', auth, setupTFA);
router.post('/verify-tfa', auth, enableTFAEndpoint);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router;
