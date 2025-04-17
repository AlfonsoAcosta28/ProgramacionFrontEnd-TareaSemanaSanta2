const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Survey = sequelize.define('Survey', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false
  }
});

const SurveyResponse = sequelize.define('SurveyResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Survey,
      key: 'id'
    }
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Establecer relaciones
Survey.hasMany(SurveyResponse, { foreignKey: 'questionId' });
SurveyResponse.belongsTo(Survey, { foreignKey: 'questionId' });

module.exports = { Survey, SurveyResponse };