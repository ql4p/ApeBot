const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ClanActivityLog extends Model {}

ClanActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ClanActivityLog',
    tableName: 'ClanActivityLogs',
    timestamps: false,
  }
);

module.exports = ClanActivityLog;