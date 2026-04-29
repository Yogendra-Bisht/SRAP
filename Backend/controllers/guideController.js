const GuidePost = require('../models/GuidePost');

// ─── @route   GET /api/guides ──────────────────────────────────────────────────
// ─── @access  Public
const getAllPosts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};

    const posts = await GuidePost.find(filter)
      .populate('author', 'name role')
      .populate('comments.author', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/guides ────────────────────────────────────────────────
// ─── @access  Public (Optional Auth)
const createPost = async (req, res, next) => {
  try {
    const { title, content, category, guestName } = req.body;

    if (!title || !content) {
      res.status(400);
      throw new Error('Title and content are required');
    }

    if (!req.user && !guestName) {
      res.status(400);
      throw new Error('Please provide your name to post as a guest.');
    }

    const postData = {
      title,
      content,
      category: category || 'General',
    };

    if (req.user) {
      postData.author = req.user._id;
    } else {
      postData.guestName = guestName;
    }

    const post = await GuidePost.create(postData);
    const populatedPost = await post.populate('author', 'name role');

    res.status(201).json({ message: 'Post created', post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/guides/:id ──────────────────────────────────────────
// ─── @access  Private (Author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await GuidePost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Guest posts can't be deleted by the user who made them (since they have no auth).
    // They can only be deleted by admins in the dev dashboard.
    if (!post.author) {
      res.status(403);
      throw new Error('Guest posts cannot be deleted. Contact support.');
    }

    if (post.author.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorised to delete this post');
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/guides/:id/like ────────────────────────────────────────
// ─── @access  Public (Optional Auth)
const toggleLike = async (req, res, next) => {
  try {
    const post = await GuidePost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Identify user by auth token or a guest device ID sent in the body
    const likerId = req.user ? req.user._id.toString() : req.body.guestId;

    if (!likerId) {
      res.status(400);
      throw new Error('Could not identify liker');
    }

    const index = post.likes.indexOf(likerId);
    if (index === -1) {
      // Like
      post.likes.push(likerId);
    } else {
      // Unlike
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/guides/:id/comments ───────────────────────────────────
// ─── @access  Public (Optional Auth)
const addComment = async (req, res, next) => {
  try {
    const { text, guestName } = req.body;

    if (!text) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    if (!req.user && !guestName) {
      res.status(400);
      throw new Error('Please provide your name to comment as a guest.');
    }

    const post = await GuidePost.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = { text };
    if (req.user) {
      comment.author = req.user._id;
    } else {
      comment.guestName = guestName;
    }

    post.comments.push(comment);
    await post.save();

    // Re-fetch to populate
    const updatedPost = await GuidePost.findById(post._id)
      .populate('author', 'name role')
      .populate('comments.author', 'name role');

    res.status(201).json({ comments: updatedPost.comments });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
};
