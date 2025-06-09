import express from 'express';
import { signup, login, logout, profile, checkAuth } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.put('/profile', protectRoute, profile);
router.get('/check', protectRoute, checkAuth);
export default router;