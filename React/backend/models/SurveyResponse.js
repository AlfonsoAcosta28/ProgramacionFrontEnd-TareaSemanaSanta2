const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Survey = require('./Survey');
const User = require('./User');

const SurveyResponse = sequelize.define('SurveyResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  surveyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Survey,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

SurveyResponse.belongsTo(Survey, { foreignKey: 'surveyId' });
SurveyResponse.belongsTo(User, { foreignKey: 'userId' });

module.exports = SurveyResponse;