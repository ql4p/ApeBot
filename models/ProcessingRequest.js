const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ProcessingRequest extends Model {}

  ProcessingRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discordId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rsn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProcessingRequest',
      tableName: 'ProcessingRequests',
      timestamps: true,
    }
  );

  return ProcessingRequest;
};
