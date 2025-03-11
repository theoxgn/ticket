'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [3, 150]
        }
      },
      description: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.ENUM('bug', 'feature', 'improvement', 'task'),
        defaultValue: 'task'
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'code_review', 'testing', 'closed'),
        defaultValue: 'open'
      },
      priority: {
        type: Sequelize.ENUM('lowest', 'low', 'medium', 'high', 'highest'),
        defaultValue: 'medium'
      },
      ticketKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      dueDate: {
        type: Sequelize.DATE
      },
      reporterId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assigneeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Projects',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tickets');
  }
};
