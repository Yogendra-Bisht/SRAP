const jwt              = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User             = require('../models/User');

// ─── Helper: generate signed JWT ─────────────────────────────────────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── Helper: check express-validator result ───────────────────────────────────
const checkValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array().map((e) => e.msg).join(', '),
      errors: errors.array(),
    });
    return false;
  }
  return true;
};

// ─── @route   POST /api/auth/register ────────────────────────────────────────
// ─── @access  Public
const registerUser = async (req, res, next) => {
  if (!checkValidation(req, res)) return; // ← validation gate

  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email already registered');
    }

    const user = await User.create({ name, email, password, role, phone });

    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/auth/login ───────────────────────────────────────────
// ─── @access  Public
const loginUser = async (req, res, next) => {
  if (!checkValidation(req, res)) return; // ← validation gate

  try {
    const { email, password } = req.body;

    // Explicitly select password (schema has select: false)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/auth/logout ──────────────────────────────────────────
// ─── @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
