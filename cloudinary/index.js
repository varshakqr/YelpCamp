// Import required modules
const cloudinary = require('cloudinary').v2; // Import the Cloudinary library
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Import Cloudinary storage for Multer

// Configure Cloudinary with your API credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

// Create a CloudinaryStorage instance for Multer
const storage = new CloudinaryStorage({
    cloudinary, // Pass in the configured Cloudinary instance
    params: {
        folder: 'YelCamp', // Set the folder where uploaded files will be stored on Cloudinary
        allowedFormat: ['jpeg', 'png', 'jpg'] // Define the allowed file formats
    }
});

// Export the configured Cloudinary and storage objects for use in other parts of your application
module.exports = {
    cloudinary, // Export the configured Cloudinary instance
    storage // Export the configured CloudinaryStorage instance for Multer
}
