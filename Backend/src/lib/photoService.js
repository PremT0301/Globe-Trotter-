const cloudinary = require('./cloudinary');
const { Readable } = require('stream');

class PhotoService {
  /**
   * Upload a photo to Cloudinary
   * @param {Buffer} fileBuffer - The file buffer from multer
   * @param {string} folder - The folder to upload to (e.g., 'profile-photos', 'trip-photos')
   * @param {string} publicId - Optional public ID for the image
   * @returns {Promise<Object>} - Cloudinary upload result
   */
  static async uploadPhoto(fileBuffer, folder = 'general', publicId = null) {
    try {
      // Convert buffer to stream for Cloudinary
      const stream = Readable.from(fileBuffer);
      
      // Upload options
      const uploadOptions = {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // Resize if too large
          { quality: 'auto:good' } // Optimize quality
        ]
      };

      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Failed to upload photo: ${error.message}`);
    }
  }

  /**
   * Delete a photo from Cloudinary
   * @param {string} publicId - The public ID of the image to delete
   * @returns {Promise<Object>} - Cloudinary deletion result
   */
  static async deletePhoto(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  }

  /**
   * Get optimized URL for a photo
   * @param {string} publicId - The public ID of the image
   * @param {Object} options - Transformation options
   * @returns {string} - Optimized URL
   */
  static getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto:good'
    };

    const finalOptions = { ...defaultOptions, ...options };
    return cloudinary.url(publicId, finalOptions);
  }
}

module.exports = PhotoService;
