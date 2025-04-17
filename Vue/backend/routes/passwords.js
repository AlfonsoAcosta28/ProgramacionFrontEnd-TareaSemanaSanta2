const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

router.post('/generate', passwordController.generatePassword);
router.get('/history', passwordController.getPasswordHistory);

module.exports = router;