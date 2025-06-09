import express from 'express';
import { getUsers, getMessages, sendMessages, getNotifications, deleteMessages } from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/notifications', protectRoute , getNotifications);
router.delete('/delete', protectRoute , deleteMessages);
router.get('/users', protectRoute , getUsers);
router.get('/:id', protectRoute , getMessages);
router.post('/send/:id', protectRoute , sendMessages);

export default router;