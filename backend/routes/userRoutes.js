import express from 'express';
import { authController } from '../controllers/userController.js';

const router = express.Router();

router.post('/google', authController.googleAuth);

router.post('/register', authController.register);

router.post('/login', authController.login);

export default router;