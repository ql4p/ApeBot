'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskTemplates', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      taskName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      taskDescription: {
        type: Sequelize.TEXT,
      },
    });

    await queryInterface.bulkInsert('TaskTemplates', [
      {
        id: 1,
        taskName: 'updateWOMGroup',
        taskDescription: 'Updates the Wise Old Man group every hour',
      },
      {
        id: 2,
        taskName: 'processRegistrationQueue',
        taskDescription: 'Processes the registration queue.',
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TaskTemplates');
  }
};
