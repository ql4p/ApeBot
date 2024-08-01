const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TaskTemplate extends Model {}

  TaskTemplate.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      taskDescription: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'TaskTemplate',
      tableName: 'TaskTemplates',
      timestamps: false,
    }
  );

  return TaskTemplate;
};
