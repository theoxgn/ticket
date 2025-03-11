// src/routes/users.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUser, 
  updateUser 
} = require('../controllers/userController');
const { 
  register, 
  login, 
  getMe 
} = require('../controllers/authController');
const { 
  protect, 
  authorize 
} = require('../middlewares/auth');
const { 
  userValidationRules,
  loginValidationRules, 
  validate 
} = require('../utils/validator');

// Public routes
router.post('/register', userValidationRules(), validate, register);
router.post('/login', loginValidationRules(), validate, login);

// Protected routes
router.use(protect);
router.get('/me', getMe);

// Admin routes
router.get('/', authorize('admin', 'manager'), getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;