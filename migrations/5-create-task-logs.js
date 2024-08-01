'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskLogs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskTemplateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TaskTemplates',
          key: 'id',
        },
      },
      lastRunTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.TEXT,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TaskLogs');
  }
};
