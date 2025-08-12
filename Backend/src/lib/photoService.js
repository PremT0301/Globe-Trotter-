const cloudinary = require('./cloudinary');
const { Readable } = require('stream');

class PhotoService {
  /**
   * Upload image to Cloudinary
   * @param {Buffer} imageBuffer - Image buffer
   * @param {string} folder - Cloudinary folder (e.g., 'trips', 'profiles')
   * @param {string} publicId - Public ID for the image
   * @returns {Promise<Object>} Cloudinary upload result
   */
  static async uploadImage(imageBuffer, folder = 'trips', publicId = null) {
    try {
      console.log('📸 PhotoService: Starting image upload', {
        bufferSize: imageBuffer?.length,
        folder,
        publicId,
        cloudinaryConfig: {
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
          api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
          api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
        }
      });

      if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
        throw new Error('Invalid image buffer provided');
      }

      // Convert buffer to stream
      const stream = Readable.from(imageBuffer);
      
      // Upload options
      const uploadOptions = {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      };

      // Add public ID if provided
      if (publicId) {
        uploadOptions.public_id = publicId;
      }

      console.log('📸 PhotoService: Upload options:', uploadOptions);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('❌ PhotoService: Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('✅ PhotoService: Upload successful:', {
                public_id: result.public_id,
                secure_url: result.secure_url,
                format: result.format,
                size: result.bytes
              });
              resolve(result);
            }
          }
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      console.error('❌ PhotoService: Error in uploadImage:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise<Object>} Cloudinary deletion result
   */
  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Generate a unique public ID for trip images
   * @param {string} tripId - Trip ID
   * @param {string} userId - User ID
   * @returns {string} Unique public ID
   */
  static generateTripImageId(tripId, userId) {
    return `trips/${userId}/${tripId}_${Date.now()}`;
  }
}

module.exports = PhotoService;
