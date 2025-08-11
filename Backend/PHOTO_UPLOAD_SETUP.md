# Photo Upload Setup Guide

This guide will help you set up Cloudinary photo upload functionality for your ODOO-25 backend.

## Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com) for a free account
2. **Node.js**: Ensure you have Node.js installed
3. **Backend Dependencies**: The required packages are already installed

## Step 1: Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to "Account Details" section
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 2: Configure Environment Variables

1. Create a `.env` file in your `Backend` folder
2. Add your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Other existing variables...
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Step 3: Test the Setup

1. Place a test image (JPEG format) named `test-image.jpg` in your `Backend` folder
2. Run the test script:

```bash
cd Backend
node test-photo-upload.js
```

If successful, you'll see upload confirmation and the image will be automatically cleaned up.

## API Endpoints

### 1. Upload Profile Photo
```
POST /api/photos/profile
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Body: photo (file)
```

**Response:**
```json
{
  "message": "Profile photo uploaded successfully",
  "photoUrl": "https://res.cloudinary.com/...",
  "publicId": "user_123_profile",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "profilePhoto": "https://res.cloudinary.com/..."
  }
}
```

### 2. Upload Trip Photo
```
POST /api/photos/trip
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Body: 
  - photo (file)
  - tripId (string)
```

### 3. Delete Photo
```
DELETE /api/photos/:publicId
Authorization: Bearer <jwt_token>
```

### 4. Get Optimized URL
```
GET /api/photos/optimized/:publicId?width=200&height=200&crop=fill
```

## Features

- **Automatic Image Optimization**: Images are automatically resized and optimized
- **File Type Validation**: Only image files are allowed
- **File Size Limit**: 5MB maximum file size
- **Automatic Cleanup**: Old profile photos are automatically deleted when replaced
- **Organized Storage**: Photos are organized in folders (profile-photos, trip-photos)
- **Secure URLs**: Uses HTTPS URLs for all uploaded images

## Frontend Integration

To use this in your frontend, you can create a form like this:

```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('/api/photos/profile', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log('Photo uploaded:', result.photoUrl);
```

## Error Handling

The API returns appropriate error messages for:
- Missing files
- Invalid file types
- File size exceeded
- Authentication failures
- Upload failures

## Security Features

- **Authentication Required**: All endpoints require valid JWT tokens
- **File Type Restriction**: Only image files are accepted
- **User Ownership**: Users can only modify their own photos
- **Automatic Cleanup**: Prevents orphaned files in Cloudinary

## Troubleshooting

### Common Issues:

1. **"Cloudinary not configured" error**
   - Check your `.env` file has all required Cloudinary variables
   - Ensure the server was restarted after adding environment variables

2. **"Only image files are allowed" error**
   - Ensure the uploaded file is an image (JPEG, PNG, GIF, etc.)
   - Check the file extension and MIME type

3. **Upload fails with authentication error**
   - Verify your JWT token is valid
   - Check that the token is included in the Authorization header

4. **File too large error**
   - Ensure the image is under 5MB
   - Consider compressing the image before upload

## Support

If you encounter issues:
1. Check the server console for detailed error messages
2. Verify your Cloudinary credentials are correct
3. Ensure all environment variables are properly set
4. Check that the required packages are installed
