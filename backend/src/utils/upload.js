import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

/**
 * Configure multer for memory storage
 * Files will be stored in memory and then uploaded to Cloudinary
 */
const storage = multer.memoryStorage();

/**
 * File filter for image/video uploads
 * @param {Object} req - Express request object
 * @param {Object} file - Multer file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image or video files are allowed'), false);
  }
};

/**
 * Multer configuration
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max per file (adjust as needed)
    files: 10, // Max 10 files
  },
});

/**
 * Upload buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer
 * @param {Object} options - Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
const cloudinaryUploadStream = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * Upload single file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} fileName - Original file name (optional, for folder organization)
 * @param {string} folder - Target folder in Cloudinary
 * @param {'image'|'video'} resourceType - Resource type (auto-detected if not provided)
 * @returns {Promise<string>} Public URL of uploaded file
 */
export const uploadToCloudinary = async (fileBuffer, fileName = 'file', folder = 'uploads', resourceType = 'image') => {
  try {
    const result = await cloudinaryUploadStream(fileBuffer, {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });
    // Return only the URL string (secure_url for HTTPS)
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<Object>} files - Array of file objects with buffer, mimetype, and originalname
 * @param {string} folder - Target folder in Cloudinary
 * @returns {Promise<Array<string>>} Array of public URLs
 */
export const uploadMultipleToCloudinary = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map((file) => {
      const isVideo = file.mimetype && file.mimetype.startsWith('video/');
      const resourceType = isVideo ? 'video' : 'image';
      return uploadToCloudinary(file.buffer, file.originalname || 'file', folder, resourceType);
    });
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete asset from Cloudinary by publicId
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    console.log(`Cloudinary asset deleted: ${publicId}`);
  } catch (error) {
    console.error('Error deleting asset from Cloudinary:', error);
    // Swallow 404-like errors
  }
};

/**
 * Delete multiple assets from Cloudinary
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<void>}
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = (publicIds || []).map((id) => deleteFromCloudinary(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple Cloudinary assets:', error);
    throw error;
  }
};

/**
 * Middleware for handling file upload errors
 */
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 20MB',
        error: {
          code: 'FILE_TOO_LARGE',
          details: error.message,
        },
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files',
        error: {
          code: 'TOO_MANY_FILES',
          details: error.message,
        },
      });
    }
  }
  
  if (error.message === 'Only image or video files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image or video files are allowed',
      error: {
        code: 'INVALID_FILE_TYPE',
        details: error.message,
      },
    });
  }
  
  next(error);
};

