const cloudinary = require('cloudinary').v2;

// Configuration is handled via environment variables by default if named correctly, 
// but we'll explicitly set them here using CLOUDINARY_* from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * @desc    Generate a signature for secure direct browser-to-cloudinary upload
 * @route   GET /api/cloudinary/sign
 * @access  Private (Authenticated users only)
 */
const getSignature = async (req, res) => {
  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: 'cafeteria_qr/payments' // Default folder for receipts
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: 'cafeteria_qr/payments'
    });
  } catch (error) {
    console.error('Cloudinary Sign Error:', error);
    res.status(500).json({ message: 'Error generating upload signature' });
  }
};

module.exports = {
  getSignature
};
