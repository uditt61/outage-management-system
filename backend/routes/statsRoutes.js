const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, getRecentTrend } = require('../controllers/statsController');

router.use(authMiddleware);

router.get('/', getDashboardStats);
router.get('/trend', getRecentTrend);

module.exports = router;