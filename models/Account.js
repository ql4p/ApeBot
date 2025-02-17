const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Account extends Model {}

  Account.init(
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
      womId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      womUsername: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isMain: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      inClan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'Accounts',
      timestamps: true,
    }
  );

  return Account;
};
