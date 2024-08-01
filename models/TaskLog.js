const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TaskLog extends Model {}

  TaskLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskTemplateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'TaskTemplates',
          key: 'id',
        },
      },
      lastRunTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'TaskLog',
      tableName: 'TaskLogs',
      timestamps: false,
    }
  );

  return TaskLog;
};
