const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const configureStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = `uploads/${destination}`;
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${destination}-${uniqueSuffix}${ext}`);
    }
  });
};

// Image file filter
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create uploadPhoto middleware for ticket photos
exports.uploadPhoto = (fieldName, destination) => {
  const storage = configureStorage(destination);
  
  return multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  }).single(fieldName);
};

// Utility to get file URL
exports.getFileUrl = (req, filePath) => {
    if (!filePath) return null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
};

// Utility to delete a file
exports.deleteFile = (filePath) => {
  if (!filePath) return;
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

/**
 * Saves a base64 image to disk and returns the URL
 * @param {string} base64String - The base64 encoded image string
 * @param {object} req - Express request object (needed for URL generation)
 * @param {string} destination - Subfolder within uploads directory
 * @returns {string|null} The URL of the saved image or null if invalid
 */
exports.saveBase64Image = (base64String, req, destination = 'tickets') => {
    // Check if the string is a valid base64 image
    if (!base64String || !base64String.startsWith('data:image/')) {
      return null;
    }
    
    // Extract image type and data
    const matches = base64String.match(/^data:image\/([A-Za-z]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }
    
    const imageType = matches[1];
    const imageData = matches[2];
    const buffer = Buffer.from(imageData, 'base64');
    
    // Create directory if it doesn't exist
    const uploadDir = `uploads/${destination}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate filename and path
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${destination}-${uniqueSuffix}.${imageType}`;
    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Generate a URL for the file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
    
    return fileUrl;
};

/**
 * Deletes a file from the filesystem
 * @param {string} filePath - Path to the file to delete
 */
exports.deleteFile = (filePath) => {
    if (!filePath) return;
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
};