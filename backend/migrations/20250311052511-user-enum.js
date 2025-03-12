'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('UserProjects');
    
    // First, ensure the ENUM type exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_userprojects_role') THEN
          CREATE TYPE "enum_userprojects_role" AS ENUM('owner', 'manager', 'member');
        END IF;
      END
      $$;
    `);
    
    // Only add the column if it doesn't already exist
    if (!tableInfo.role) {
      await queryInterface.addColumn('UserProjects', 'role', {
        type: Sequelize.ENUM('owner', 'manager', 'member'),
        defaultValue: 'member'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('UserProjects');
    if (tableInfo.role) {
      await queryInterface.removeColumn('UserProjects', 'role');
    }
  }
};