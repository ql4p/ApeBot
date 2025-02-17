const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
          model: 'Users',
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
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ClanActivityLog',
      tableName: 'ClanActivityLogs',
      timestamps: false,
    }
  );

  return ClanActivityLog;
};
