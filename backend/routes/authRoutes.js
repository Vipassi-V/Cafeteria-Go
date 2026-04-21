const express = require('express');
const router = express.Router();
const { getMe, syncUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

// Public/Brute-force protected routes
router.post('/sync', authLimiter, protect, syncUser);

// Private routes
router.get('/me', protect, getMe);

module.exports = router;
