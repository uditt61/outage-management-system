const express = require('express');
const router = express.Router();
const { getAllOutages, createOutage, getUserOutages, getAssignedOutages, updateOutage } = require('../controllers/outageController');

router.get('/', getAllOutages);
router.post('/', createOutage);
router.get('/user/:userId', getUserOutages);
router.get('/assigned/:userId', getAssignedOutages);
router.put('/:id', updateOutage);

module.exports = router;