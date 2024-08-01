const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProcessingLog extends Model {}

  ProcessingLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ProcessingRequests',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actionBy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProcessingLog',
      tableName: 'ProcessingLogs',
      timestamps: false,
    }
  );

  return ProcessingLog;
};
