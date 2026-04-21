const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController');

router.get('/:canteenCode', getMenu);

module.exports = router;
