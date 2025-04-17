const { Survey, SurveyResponse } = require('../models/Survey');

// Crear una nueva encuesta
exports.createSurvey = async (req, res) => {
  console.log(req.body);
  try {
    const survey = await Survey.create(req.body);
    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error.message);
  }
};

// Obtener todas las encuestas
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.findAll();
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Responder a una encuesta
exports.respondToSurvey = async (req, res) => {
  console.log(req.body);
  const { surveyId, answer } = req.body;
  questionId = surveyId;
  
  try {
    const survey = await Survey.findByPk(questionId);
    if (!survey) {
      console.error('Encuesta no encontrada');
      return res.status(404).json({ message: 'Encuesta no encontrada' });
      
    }
    
    const response = await SurveyResponse.create({
      questionId,
      answer
    });
    
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.error(error.message);
  }
};

// Obtener resultados de una encuesta
exports.getSurveyResults = async (req, res) => {
  const { id } = req.params;
  
  try {
    const survey = await Survey.findByPk(id);
    if (!survey) {
      return res.status(404).json({ message: 'Encuesta no encontrada' });
    }
    
    const responses = await SurveyResponse.findAll({
      where: { questionId: id }
    });
    
    // Contar respuestas por opción
    const options = survey.options;
    const results = {};
    
    options.forEach(option => {
      results[option] = 0;
    });
    
    responses.forEach(response => {
      if (results[response.answer] !== undefined) {
        results[response.answer]++;
      }
    });
    
    res.json({
      question: survey.question,
      options: survey.options,
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};