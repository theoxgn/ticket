// src/controllers/projectController.js
const { Project, User, Ticket, UserProjects } = require('../models');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, key } = req.body;

    // Create project
    const project = await Project.create({
      name,
      description,
      key: key.toUpperCase()
    });

    // Add creator as project owner
    await project.addMember(req.user.id, { 
      through: { role: 'owner' } 
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{
        model: User,
        as: 'members',
        through: { 
          attributes: []
        }
      }]
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'username', 'firstName', 'lastName'],
          through: { attributes: ['role'] }
        },
        {
          model: Ticket,
          as: 'tickets',
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
            }
          ]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is authorized (admin or project owner/manager)
    const userProject = await project.getMembers({
      where: { id: req.user.id },
      through: { where: { role: ['owner', 'manager'] } }
    });

    if (userProject.length === 0 && req.user.role !== 'admin' || req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    project = await project.update(req.body);

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add user to project
exports.addUserToProject = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const project = await Project.findByPk(req.params.id);
    const user = await User.findByPk(userId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user is already in project
    const userExists = await project.hasMember(userId);
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already in project' });
    }

    await project.addMember(userId, { 
      through: { role: role || 'member' } 
    });

    res.status(200).json({
      success: true,
      message: 'User added to project'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is authorized (admin or project owner)
    const userProjects = await project.getMembers({
      where: { id: req.user.id },
      through: { where: { role: 'owner' } }
    });

    if (userProjects.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Remove user from project
exports.removeUserFromProject = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user exists in project
    const userExists = await project.hasMember(userId);
    
    if (!userExists) {
      return res.status(400).json({ success: false, message: 'User not in project' });
    }

    // Check if current user is authorized (admin or project owner/manager)
    const currentUserRole = await project.getMembers({
      where: { id: req.user.id },
      through: { where: { role: ['owner', 'manager'] } }
    });

    if (currentUserRole.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await project.removeMember(userId);

    res.status(200).json({
      success: true,
      message: 'User removed from project'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
