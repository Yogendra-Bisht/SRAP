const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/upload
// @desc    Upload multiple images to Cloudinary
// @access  Private (Landlord only)
router.post('/', protect, upload.array('images', 5), (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can upload room images' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // Extract the secure URLs from the uploaded files
    const imageUrls = req.files.map(file => file.path);
    res.status(200).json({ urls: imageUrls });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
