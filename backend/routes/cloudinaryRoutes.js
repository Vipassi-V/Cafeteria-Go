const express = require('express');
const router = express.Router();
const { getSignature } = require('../controllers/cloudinaryController');
const { protect } = require('../middleware/auth');

router.get('/sign', protect, getSignature);

module.exports = router;
