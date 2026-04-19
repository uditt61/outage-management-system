const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTechnicians } = require('../controllers/userController');

router.use(authMiddleware);

router.get('/technicians', getTechnicians);

module.exports = router;