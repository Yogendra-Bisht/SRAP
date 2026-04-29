const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require authentication
// POST   /api/bookings          → create a booking
router.post('/', protect, createBooking);

// GET    /api/bookings/my       → get current user's bookings
router.get('/my', protect, getMyBookings);

// GET    /api/bookings/:id      → get single booking
router.get('/:id', protect, getBookingById);

// DELETE /api/bookings/:id      → cancel a booking
router.delete('/:id', protect, cancelBooking);

module.exports = router;
