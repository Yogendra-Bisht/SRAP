const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
} = require('../controllers/guideController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllPosts)
  .post(optionalAuth, createPost);

router.route('/:id')
  .delete(protect, deletePost);

router.put('/:id/like', optionalAuth, toggleLike);
router.post('/:id/comments', optionalAuth, addComment);

module.exports = router;
