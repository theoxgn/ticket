// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Protect routes middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized to access this route' 
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ 
          success: false,
          message: 'User account has been deactivated' 
        });
      }

      req.user = {
        id: user.id,
        role: user.role
      };
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized to access this route' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Authorize based on role middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};