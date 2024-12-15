const express = require('express');
const router = express.Router();
const { createTestUser, getTestUser } = require('../controllers/userController');

// Route to create a test user if not exists
router.post('/', createTestUser);

// Route to retrieve the existing test user
router.get('/', getTestUser);

module.exports = router;