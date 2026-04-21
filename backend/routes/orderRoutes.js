const express = require('express');
const router = express.Router();
const { createOrder, getMyHistory } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my-history', protect, getMyHistory);

module.exports = router;
