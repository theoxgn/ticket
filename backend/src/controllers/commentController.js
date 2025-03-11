// src/controllers/commentController.js
const { Comment, User } = require('../models');

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user is the comment author
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.update({ content });

    // Fetch the updated comment with user information
    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user is the comment author or admin
    if (comment.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.destroy();

    res.status(200).json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get comments for a ticket
exports.getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const comments = await Comment.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { content, ticketId } = req.body;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const comment = await Comment.create({
      content,
      ticketId,
      userId: req.user.id
    });

    // Fetch the created comment with user information
    const newComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
