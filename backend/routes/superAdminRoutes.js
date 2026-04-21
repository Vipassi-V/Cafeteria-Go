const express = require('express');
const router = express.Router();
const { createCanteen, getAllCanteens, getGlobalStats } = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

// All routes here require SuperAdmin role
router.use(protect);
router.use(authorize('superadmin'));

router.post('/canteen', createCanteen);
router.get('/canteens', getAllCanteens);
router.get('/stats', getGlobalStats);

module.exports = router;
