// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./src/routes/users'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/tickets', require('./src/routes/tickets'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ticket Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

// Test connection to database and start server
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      sequelize.sync({ alter: true }).then(() => {
        console.log('Database synced');
      });
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});