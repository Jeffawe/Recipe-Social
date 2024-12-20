import express from 'express';
import { createTestUser, getTestUser } from '../controllers/userController.js';

const router = express.Router();

// Route to create a test user if not exists
router.post('/', createTestUser);

// Route to retrieve the existing test user
router.get('/', getTestUser);

export default router;