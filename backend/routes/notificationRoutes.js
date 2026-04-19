const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/:userId', getUserNotifications);
router.put('/:id/read', markAsRead);
router.put('/user/:userId/read-all', markAllAsRead);

module.exports = router;