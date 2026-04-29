const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

// GET  /api/rooms          → all listings (public)
router.get('/', getAllRooms);

// GET  /api/rooms/:id      → single room (public)
router.get('/:id', getRoomById);

// POST /api/rooms          → create a listing (protected)
router.post('/', protect, createRoom);

// PUT  /api/rooms/:id      → update a listing (protected)
router.put('/:id', protect, updateRoom);

// DELETE /api/rooms/:id   → delete a listing (protected)
router.delete('/:id', protect, deleteRoom);

module.exports = router;
