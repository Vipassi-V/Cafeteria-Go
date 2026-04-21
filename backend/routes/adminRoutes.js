const express = require('express');
const router = express.Router();
const { getAdminOrders, updateOrderStatus } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Protected admin routes: requires JWT and admin role check is handled inside controller
router.get('/orders', protect, getAdminOrders);
router.patch('/orders/:id/status', protect, updateOrderStatus);

module.exports = router;
