import express from 'express';
import {
  sendMessage,
  getMessages,
  markAsRead,
  getUnreadCount
} from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, sendMessage);
router.get('/', auth, getMessages);
router.put('/:id/read', auth, markAsRead);
router.get('/unread-count', auth, getUnreadCount);

export default router;
