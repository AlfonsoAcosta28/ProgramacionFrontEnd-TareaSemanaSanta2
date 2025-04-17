const express = require('express');
const router = express.Router();
const { Survey, SurveyResponse } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todas las encuestas
router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(surveys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Crear una nueva encuesta
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question, options } = req.body;
    const survey = await Survey.create({
      question,
      options
    });
    res.status(201).json(survey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Enviar una respuesta a una encuesta
router.post('/:id/respond', authMiddleware, async (req, res) => {
  try {
    const { answer } = req.body;
    const surveyId = req.params.id;
    
    // Verificar si la encuesta existe
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }
    
    // Verificar si el usuario ya respondió esta encuesta
    const existingResponse = await SurveyResponse.findOne({
      where: {
        surveyId,
        userId: req.user.id
      }
    });
    
    if (existingResponse) {
      return res.status(400).json({ message: 'Ya has respondido a esta encuesta' });
    }
    
    // Guardar respuesta
    const response = await SurveyResponse.create({
      answer,
      surveyId,
      userId: req.user.id
    });
    
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener resultados de una encuesta
router.get('/:id/results', async (req, res) => {
  try {
    const surveyId = req.params.id;
    
    // Verificar si la encuesta existe
    const survey = await Survey.findByPk(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }
    
    // Obtener todas las respuestas
    const responses = await SurveyResponse.findAll({
      where: { surveyId }
    });
    
    // Calcular resultados
    const options = survey.options;
    const results = options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});
    
    responses.forEach(response => {
      results[response.answer] = (results[response.answer] || 0) + 1;
    });
    
    res.json({
      survey,
      results,
      totalResponses: responses.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;