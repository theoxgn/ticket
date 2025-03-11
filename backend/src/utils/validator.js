// src/utils/validators.js
const { body, validationResult } = require('express-validator');

// User validation rules
exports.userValidationRules = () => {
  return [
    body('username', 'Username is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    body('firstName', 'First name is required').not().isEmpty(),
    body('lastName', 'Last name is required').not().isEmpty(),
  ];
};

// Login validation rules
exports.loginValidationRules = () => {
  return [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ];
};

// Project validation rules
exports.projectValidationRules = () => {
  return [
    body('name', 'Project name is required').not().isEmpty(),
    body('key', 'Project key is required (2-10 characters)').isLength({ min: 2, max: 10 })
  ];
};

// Ticket validation rules
exports.ticketValidationRules = () => {
  return [
    body('title', 'Ticket title is required').not().isEmpty(),
    body('projectId', 'Project ID is required').not().isEmpty()
  ];
};

// Comment validation rules
exports.commentValidationRules = () => {
  return [
    body('content', 'Comment content is required').not().isEmpty()
  ];
};

// Validate results middleware
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};