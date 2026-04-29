/**
 * notFound
 * Catches any request that didn't match a route and forwards a 404 error.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler
 * Global error handler — must be the LAST middleware in server.js
 * Handles Mongoose validation errors, cast errors, and generic errors.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message    = err.message;

  // Mongoose bad ObjectId (e.g. /api/rooms/not-an-id)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message    = 'Invalid resource ID';
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  res.status(statusCode).json({
    message,
    // Only expose stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
