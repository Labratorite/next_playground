'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('WorkflowApprovers', {
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
        type: Sequelize.INTEGER
      },
      workflowNodeId: {
        allowNull: false,
        references: {
          model: {
            tableName: 'WorkflowNodes'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER
      },
      orderNo: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.TINYINT
      },
      /*
      approvableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      approvableType: {
        type: Sequelize.ENUM('user', 'rank'),
        allowNull: false,
      },
      */
      approverId: {
        allowNull: false,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('WorkflowApprovers');
  }
};
