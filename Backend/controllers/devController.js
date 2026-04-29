const User    = require('../models/User');
const Room    = require('../models/Room');
const Booking = require('../models/Booking');
const GuidePost = require('../models/GuidePost');

// ─── GET /api/dev/stats ───────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRooms, students, landlords, availableRooms, bookedRooms, totalBookings, totalGuides] = await Promise.all([
      User.countDocuments(),
      Room.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'landlord' }),
      Room.countDocuments({ isAvailable: true }),
      Room.countDocuments({ isAvailable: false }),
      Booking.countDocuments(),
      GuidePost.countDocuments(),
    ]);

    res.json({
      users:    { total: totalUsers, students, landlords },
      rooms:    { total: totalRooms, available: availableRooms, booked: bookedRooms },
      bookings: { total: totalBookings, pending: await Booking.countDocuments({ status: 'pending' }), confirmed: await Booking.countDocuments({ status: 'confirmed' }), cancelled: await Booking.countDocuments({ status: 'cancelled' }) },
      guides:   { total: totalGuides }
    });
  } catch (err) { next(err); }
};

// ─── GET /api/dev/users ───────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) { next(err); }
};

// ─── GET /api/dev/rooms ───────────────────────────────────────────────────────
const getAllRoomsDev = async (req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json({ count: rooms.length, rooms });
  } catch (err) { next(err); }
};

// ─── GET /api/dev/bookings ────────────────────────────────────────────────────
const getAllBookingsDev = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('room',    'title location price')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json({ count: bookings.length, bookings });
  } catch (err) { next(err); }
};

// ── Guides ────────────────────────────────────────────────────────────────────
const getAllGuidesDev = async (req, res, next) => {
  try {
    const guides = await GuidePost.find()
      .populate('author', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ guides });
  } catch (error) {
    next(error);
  }
};

const deleteGuideDev = async (req, res, next) => {
  try {
    const guide = await GuidePost.findById(req.params.id);
    if (!guide) {
      res.status(404);
      throw new Error('Guide not found');
    }
    await guide.deleteOne();
    res.status(200).json({ message: 'Guide deleted by admin' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, getAllRoomsDev, getAllBookingsDev, getAllGuidesDev, deleteGuideDev };
