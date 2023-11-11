'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('WorkflowNodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      workflowId: {
        allowNull: false,
        references: {
          model: {
            tableName: 'Workflows'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER
      },
      operator: {
        allowNull: true,
        type: Sequelize.ENUM('and', 'or'),
      },
      nodeLv: {
        allowNull: false,
        comment: 'ノード深度',
        type: Sequelize.TINYINT
      },
      /*
      isRoot: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      */
      isReaf: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable('WorkflowNodes');
  }
};
