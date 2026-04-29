const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateProfile,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes below are protected (require login)
// GET  /api/users/me
router.get('/me', protect, getMyProfile);

// PUT  /api/users/me
router.put('/me', protect, updateProfile);

// DELETE /api/users/me
router.delete('/me', protect, deleteAccount);

module.exports = router;
