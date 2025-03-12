const multer = require('multer');

// Middleware to handle multer upload errors
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size limit exceeded. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  } else if (err) {
    if (err.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
  next();
};

module.exports = uploadErrorHandler;