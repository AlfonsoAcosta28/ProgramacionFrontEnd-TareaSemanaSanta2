const express = require('express');
const router = express.Router();
const converterController = require('../controllers/converterController');

router.post('/temperature', converterController.convertTemperature);
router.post('/length', converterController.convertLength);
router.post('/weight', converterController.convertWeight);

module.exports = router;