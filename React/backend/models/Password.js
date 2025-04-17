const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Password = sequelize.define('Password', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  length: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hasSpecialChars: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  hasNumbers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

Password.belongsTo(User, { foreignKey: 'userId' });

module.exports = Password;