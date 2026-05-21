const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookings,
  acceptBooking,
  rejectBooking,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// All booking routes require authentication
// POST   /api/bookings          → create a booking
router.post('/', protect, createBooking);

// GET    /api/bookings/owner    → get landlord's rooms' bookings
router.get('/owner', protect, restrictTo('landlord'), getOwnerBookings);

// GET    /api/bookings/my       → get current user's bookings
router.get('/my', protect, getMyBookings);

// GET    /api/bookings/:id      → get single booking
router.get('/:id', protect, getBookingById);

// PATCH  /api/bookings/:id/accept → accept a booking request
router.patch('/:id/accept', protect, restrictTo('landlord'), acceptBooking);

// PATCH  /api/bookings/:id/reject → reject/deny a booking request
router.patch('/:id/reject', protect, restrictTo('landlord'), rejectBooking);

// DELETE /api/bookings/:id      → cancel a booking
router.delete('/:id', protect, cancelBooking);

module.exports = router;
