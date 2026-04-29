const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// ── Validation rules ──────────────────────────────────────────────────────────
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .isLength({ max: 128 }).withMessage('Password too long'),

  body('role')
    .optional()
    .isIn(['student', 'landlord']).withMessage('Role must be student or landlord'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const forgotValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
];

const resetValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ── Routes ────────────────────────────────────────────────────────────────────
router.post('/register',        registerValidation,  registerUser);
router.post('/login',           loginValidation,     loginUser);
router.post('/logout',                               logoutUser);
router.post('/forgot-password', forgotValidation,    forgotPassword);
router.post('/reset-password/:token', resetValidation, resetPassword);

module.exports = router;
