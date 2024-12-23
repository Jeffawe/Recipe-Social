import express from 'express';
import { authController } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/google', authController.googleAuth);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/verify', authenticateToken, authController.verify);

export default router;