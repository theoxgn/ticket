// src/routes/tickets.js
const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getAllTickets, 
  getTicket, 
  updateTicket, 
  addComment 
} = require('../controllers/ticketController');
const { uploadPhoto } = require('../controllers/uploadController');
const uploadErrorHandler = require('../middlewares/uploadErrorHandler');
const {
  deleteComment,
  updateComment
} = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');
const { 
  commentValidationRules, 
  validate 
} = require('../utils/validator');

// All routes are protected
router.use(protect);
router.post('/', uploadPhoto('photo', 'tickets'),uploadErrorHandler,createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicket);
router.put('/:id', uploadPhoto('photo', 'tickets'), uploadErrorHandler, updateTicket);
// Comment routes
router.post('/:id/comments', commentValidationRules(), validate, addComment);
router.put('/comments/:id', commentValidationRules(), validate, updateComment);
router.delete('/comments/:id', deleteComment);

module.exports = router;