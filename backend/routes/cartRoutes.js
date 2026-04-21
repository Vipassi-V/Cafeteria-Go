const express = require('express');
const router = express.Router();
const { syncCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.post('/sync', protect, syncCart);

module.exports = router;
