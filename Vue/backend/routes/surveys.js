const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

router.post('/', surveyController.createSurvey);
router.get('/', surveyController.getAllSurveys);
router.post('/respond', surveyController.respondToSurvey);
router.get('/:id/results', surveyController.getSurveyResults);

module.exports = router;