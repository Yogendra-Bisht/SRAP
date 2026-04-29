const express = require('express');
const router  = express.Router();
const { getStats, getAllUsers, getAllRoomsDev, getAllBookingsDev, getAllGuidesDev, deleteGuideDev } = require('../controllers/devController');

// ── Dev Secret Middleware ───────────────────────────────────────────────────
// All /api/dev/* routes require the header: x-dev-key: <DEV_SECRET>
const devGuard = (req, res, next) => {
  const key = req.headers['x-dev-key'];
  if (!key || key !== process.env.DEV_SECRET) {
    return res.status(403).json({ message: 'Forbidden — invalid dev key' });
  }
  next();
};

router.use(devGuard);

router.get('/stats',    getStats);
router.get('/users',    getAllUsers);
router.get('/rooms',    getAllRoomsDev);
router.get('/bookings', getAllBookingsDev);
router.get('/guides',   getAllGuidesDev);
router.delete('/guides/:id', deleteGuideDev);

module.exports = router;
