const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getMatches,
} = require('../controllers/roommateController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/profile')
  .get(getProfile)
  .post(updateProfile);

router.get('/matches', getMatches);

module.exports = router;
