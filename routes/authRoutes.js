const express = require('express');
const { register, login, profile } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user and get JWT token
router.post('/login', login);

// Get user profile (protected)
router.get('/profile', authenticate, profile);

module.exports = router;
