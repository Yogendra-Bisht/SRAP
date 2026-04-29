const Booking = require('../models/Booking');
const Room    = require('../models/Room');

// ─── @route   POST /api/bookings ──────────────────────────────────────────────
// ─── @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, message } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (!room.isAvailable) {
      res.status(400);
      throw new Error('Room is not available for booking');
    }

    // Prevent a landlord from booking their own room
    if (room.owner.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot book your own listing');
    }

    // Calculate total price (price per month × months difference, minimum 1)
    const checkInDate  = new Date(checkIn);
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    const months = checkOutDate
      ? Math.max(
          1,
          Math.ceil(
            (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24 * 30)
          )
        )
      : 1;
    const totalPrice = room.price * months;

    const booking = await Booking.create({
      room:       roomId,
      student:    req.user._id,
      checkIn:    checkInDate,
      checkOut:   checkOutDate,
      totalPrice,
      message,
    });

    // Mark room as unavailable
    await Room.findByIdAndUpdate(roomId, { isAvailable: false });

    await booking.populate([
      { path: 'room',    select: 'title location price' },
      { path: 'student', select: 'name email' },
    ]);

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/bookings/my ───────────────────────────────────────────
// ─── @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('room', 'title location price images')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/bookings/:id ──────────────────────────────────────────
// ─── @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room',    'title location price images owner')
      .populate('student', 'name email phone');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Only the student or the room's owner can view this booking
    const isStudent = booking.student._id.toString() === req.user._id.toString();
    const isOwner   = booking.room.owner.toString()   === req.user._id.toString();

    if (!isStudent && !isOwner) {
      res.status(403);
      throw new Error('Not authorised to view this booking');
    }

    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/bookings/:id ───────────────────────────────────────
// ─── @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.student.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorised — you did not make this booking');
    }

    if (booking.status === 'cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore room availability
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.status(200).json({ message: 'Booking cancelled', booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBookingById, cancelBooking };
