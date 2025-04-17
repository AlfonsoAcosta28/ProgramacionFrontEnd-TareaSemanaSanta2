const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Password = sequelize.define('Password', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hasUppercase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hasLowercase: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hasNumbers: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hasSymbols: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Password;