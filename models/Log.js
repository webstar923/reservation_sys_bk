const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Log = sequelize.define('Log', {
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  readStatus: {
    type: DataTypes.STRING,
    defaultValue: 'unread', 
    allowNull: false,
  },
    },
  { 
    timestamps: false,
  });;

module.exports = Log;
