// src/controllers/ticketController.js
const { Ticket, User, Project, Comment } = require('../models');
const uploadController = require('./uploadController');

// Create new ticket
exports.createTicket = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      type, 
      priority, 
      projectId, 
      assigneeId,
      videoLink 
    } = req.body;

    // Validate project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Generate ticket key (e.g., PRJ-123)
    const ticketCount = await Ticket.count({ where: { projectId } });
    const ticketKey = `${project.key}-${ticketCount + 1}`;

    let photoUrl = null;
    if (req.file) {
      photoUrl = uploadController.getFileUrl(req, req.file.path);
    } else if (req.body.photoUrl && req.body.photoUrl.startsWith('data:image/')) {
      photoUrl = uploadController.saveBase64Image(req.body.photoUrl, req, 'tickets');
    } else if (req.body.photoUrl) {
      photoUrl = req.body.photoUrl;
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      type,
      priority,
      ticketKey,
      projectId,
      reporterId: req.user.id,
      assigneeId: assigneeId || null,
      photoUrl,
      videoLink
    });

    // Fetch the created ticket with associations
    const createdTicket = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'key']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdTicket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const { status, type, priority, projectId } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (projectId) filter.projectId = projectId;

    const tickets = await Ticket.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'key']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get single ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'key']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check authorization (assignee, reporter, admin, or project manager)
    const isProjectMember = await ticket.getProject().then(project => {
      return project.getMembers({
        where: { id: req.user.id },
        through: { where: { role: ['owner', 'manager'] } }
      });
    });

    if (
      ticket.assigneeId !== req.user.id && 
      ticket.reporterId !== req.user.id && 
      req.user.role !== 'admin' && 
      isProjectMember.length === 0
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    let photoUrl = ticket.photoUrl; 
    if (req.file) {
      // If a new file was uploaded via multer
      photoUrl = uploadController.getFileUrl(req, req.file.path);
      
      // Delete old file if it exists
      if (ticket.photoUrl && ticket.photoUrl.includes('/uploads/')) {
        const oldPhotoPath = ticket.photoUrl.split('/uploads/')[1];
        if (oldPhotoPath) {
          // Full path would be 'uploads/' + oldPhotoPath
          uploadController.deleteFile(`uploads/${oldPhotoPath}`);
        }
      }
    } else if (req.body.photoUrl && req.body.photoUrl.startsWith('data:image/')) {
      // If a new base64 image string was provided
      photoUrl = uploadController.saveBase64Image(req.body.photoUrl, req, 'tickets');
      
      // Delete old file if it exists
      if (ticket.photoUrl && ticket.photoUrl.includes('/uploads/')) {
        const oldPhotoPath = ticket.photoUrl.split('/uploads/')[1];
        if (oldPhotoPath) {
          uploadController.deleteFile(`uploads/${oldPhotoPath}`);
        }
      }
    } else if (req.body.photoUrl !== undefined) {
      // If photoUrl was explicitly set in the request (could be empty string to remove)
      photoUrl = req.body.photoUrl;
    }

    // Update ticket
    ticket = await ticket.update({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      priority: req.body.priority,
      status: req.body.status,
      assigneeId: req.body.assigneeId,
      photoUrl,
      videoLink: req.body.videoLink
    });

    // Fetch the updated ticket with associations
    const updatedTicket = await Ticket.findByPk(ticket.id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'username', 'firstName', 'lastName']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'name', 'key']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add comment to ticket
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const ticketId = req.params.id;

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
// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check authorization (admin or project manager/owner)
    const isProjectMember = await ticket.getProject().then(project => {
      return project.getMembers({
        where: { id: req.user.id },
        through: { where: { role: ['owner', 'manager'] } }
      });
    });

    if (req.user.role !== 'admin' && isProjectMember.length === 0) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await ticket.destroy();

    res.status(200).json({
      success: true,
      message: 'Ticket deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
