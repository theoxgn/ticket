// migrations/20250312080026-add-photo-video-fields-to-tickets.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Try to add photoUrl column
      try {
        await queryInterface.addColumn('Tickets', 'photoUrl', {
          type: Sequelize.STRING,
          allowNull: true
        });
        console.log('Added photoUrl column to Tickets table');
      } catch (error) {
        // If error is because column already exists, log and continue
        if (error.message.includes('already exists')) {
          console.log('photoUrl column already exists in Tickets table');
        } else {
          // If it's another error, throw it
          throw error;
        }
      }
      
      // Try to add videoLink column
      try {
        await queryInterface.addColumn('Tickets', 'videoLink', {
          type: Sequelize.STRING,
          allowNull: true
        });
        console.log('Added videoLink column to Tickets table');
      } catch (error) {
        // If error is because column already exists, log and continue
        if (error.message.includes('already exists')) {
          console.log('videoLink column already exists in Tickets table');
        } else {
          // If it's another error, throw it
          throw error;
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Try to remove photoUrl column
    try {
      await queryInterface.removeColumn('Tickets', 'photoUrl');
      console.log('Removed photoUrl column from Tickets table');
    } catch (error) {
      console.log('Error removing photoUrl column:', error.message);
    }
    
    // Try to remove videoLink column
    try {
      await queryInterface.removeColumn('Tickets', 'videoLink');
      console.log('Removed videoLink column from Tickets table');
    } catch (error) {
      console.log('Error removing videoLink column:', error.message);
    }
  }
};