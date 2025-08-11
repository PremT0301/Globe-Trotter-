const fs = require('fs');
const path = require('path');
const PhotoService = require('./src/lib/photoService');

// Test photo upload functionality
async function testPhotoUpload() {
  try {
    console.log('Testing photo upload functionality...');
    
    // Check if test image exists
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      console.log('No test image found. Please place a test image named "test-image.jpg" in the Backend folder.');
      console.log('You can use any small JPEG image for testing.');
      return;
    }

    // Read test image
    const imageBuffer = fs.readFileSync(testImagePath);
    console.log('Test image loaded successfully');

    // Test upload
    console.log('Uploading test image to Cloudinary...');
    const result = await PhotoService.uploadPhoto(
      imageBuffer,
      'test-uploads',
      'test_upload_' + Date.now()
    );

    console.log('Upload successful!');
    console.log('Public ID:', result.public_id);
    console.log('URL:', result.secure_url);
    console.log('Size:', result.bytes, 'bytes');

    // Test optimized URL generation
    const optimizedUrl = PhotoService.getOptimizedUrl(result.public_id, {
      width: 200,
      height: 200,
      crop: 'fill'
    });
    console.log('Optimized URL (200x200):', optimizedUrl);

    // Clean up - delete test image
    console.log('Cleaning up test image...');
    await PhotoService.deletePhoto(result.public_id);
    console.log('Test image deleted successfully');

  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('\nMake sure you have:');
    console.log('1. Set up your .env file with Cloudinary credentials');
    console.log('2. Placed a test image named "test-image.jpg" in the Backend folder');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testPhotoUpload();
}

module.exports = { testPhotoUpload };
