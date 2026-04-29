const User = require('../models/User');

// ─── @route   GET /api/users/me ──────────────────────────────────────────────
// ─── @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/users/me ──────────────────────────────────────────────
// ─── @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'phone', 'avatar'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Prevent password update through this route (use a dedicated change-password route)
    if (req.body.password) {
      res.status(400);
      throw new Error('Use the change-password route to update your password');
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/users/me ───────────────────────────────────────────
// ─── @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, updateProfile, deleteAccount };
