// src/routes/projects.js
const express = require('express');
const router = express.Router();
const { 
  createProject, 
  getAllProjects, 
  getProject, 
  updateProject, 
  addUserToProject 
} = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');
const { 
  projectValidationRules, 
  validate 
} = require('../utils/validator');

// All routes are protected
router.use(protect);

router.post('/', projectValidationRules(), validate, createProject);
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.post('/:id/users', addUserToProject);

module.exports = router;