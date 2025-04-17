const User = require('./User');
const Task = require('./Task');
const Password = require('./Password');
const Survey = require('./Survey');
const SurveyResponse = require('./SurveyResponse');
const Event = require('./Event');

// Definir relaciones
User.hasMany(Task, { foreignKey: 'userId' });
User.hasMany(Password, { foreignKey: 'userId' });
User.hasMany(SurveyResponse, { foreignKey: 'userId' });
User.hasMany(Event, { foreignKey: 'userId' });
Survey.hasMany(SurveyResponse, { foreignKey: 'surveyId' });

module.exports = {
  User,
  Task,
  Password,
  Survey,
  SurveyResponse,
  Event
};