const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect
 * Middleware to guard private routes.
 * Expects: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised — no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorised — user not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorised — invalid or expired token' });
  }
};

/**
 * optionalAuth
 * Parses the token if it exists, otherwise proceeds as guest
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (error) {
    // Ignore error, proceed as guest
  }
  next();
};

/**
 * restrictTo
 * Role-based access control middleware.
 * Usage: restrictTo('landlord')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied — only ${roles.join(' or ')} can perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalAuth, restrictTo };
