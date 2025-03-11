'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, create the ENUM type if it doesn't exist
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_userprojects_role') THEN
          CREATE TYPE "enum_userprojects_role" AS ENUM('owner', 'manager', 'member');
        END IF;
      END
      $$;
    `);
    
    // Then add the column
    await queryInterface.addColumn('UserProjects', 'role', {
      type: Sequelize.ENUM('owner', 'manager', 'member'),
      defaultValue: 'member'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserProjects', 'role');
  }
};