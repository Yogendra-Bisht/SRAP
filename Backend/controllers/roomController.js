const Room = require('../models/Room');

// ─── @route   GET /api/rooms ──────────────────────────────────────────────────
// ─── @access  Public
// Supports: ?city= &minPrice= &maxPrice= &roomType= &gender= &page= &limit=
const getAllRooms = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, roomType, gender } = req.query;

    // ── Pagination ────────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12); // cap at 50
    const skip  = (page - 1) * limit;

    // ── Filters ───────────────────────────────────────────────────────────────
    const filter = { isAvailable: true };

    if (city)     filter['location.city'] = { $regex: city, $options: 'i' };
    if (roomType) filter.roomType         = roomType;
    if (gender)   filter.gender           = gender;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate('owner', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Room.countDocuments(filter),
    ]);

    res.status(200).json({
      count:      rooms.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @route   GET /api/rooms/:id ─────────────────────────────────────────────
// ─── @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      'owner',
      'name email phone'
    );

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    res.status(200).json({ room });
  } catch (error) {
    next(error);
  }
};

// ─── @route   POST /api/rooms ─────────────────────────────────────────────────
// ─── @access  Private (landlord role only)
const createRoom = async (req, res, next) => {
  try {
    // Role guard — only landlords can list rooms
    if (req.user.role !== 'landlord') {
      res.status(403);
      throw new Error('Only landlords can create room listings');
    }

    const room = await Room.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ message: 'Room listing created', room });
  } catch (error) {
    next(error);
  }
};

// ─── @route   PUT /api/rooms/:id ─────────────────────────────────────────────
// ─── @access  Private (owner only)
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorised — you do not own this listing');
    }

    // Prevent owner field from being overwritten via body
    delete req.body.owner;

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Room updated', room: updatedRoom });
  } catch (error) {
    next(error);
  }
};

// ─── @route   DELETE /api/rooms/:id ──────────────────────────────────────────
// ─── @access  Private (owner only)
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorised — you do not own this listing');
    }

    await room.deleteOne();
    res.status(200).json({ message: 'Room listing deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom };
