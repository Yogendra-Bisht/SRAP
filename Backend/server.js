const express   = require('express');
const dotenv    = require('dotenv');

// Load env variables first!
dotenv.config();

const connectDB = require('./config/db');
const cors      = require('cors');
const morgan    = require('morgan');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');

// Route imports
const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const roomRoutes    = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const devRoutes     = require('./routes/devRoutes');
const uploadRoutes  = require('./routes/uploadRoutes');
const guideRoutes   = require('./routes/guideRoutes');
const roommateRoutes = require('./routes/roommateRoutes');

// Error middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
connectDB();

const app = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // prevent giant payloads

// ── HTTP request logger (dev only) ───────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Rate limiters ─────────────────────────────────────────────────────────────
// General API limiter: 100 requests per 15 min per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again in 15 minutes.' },
});

// Strict auth limiter: max 10 login/register attempts per 15 min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts. Please wait 15 minutes before trying again.' },
  skipSuccessfulRequests: true, // only count failed attempts
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('NEST API is running...'));

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dev',      devRoutes);
app.use('/api/upload',   uploadRoutes);
app.use('/api/guides',   guideRoutes);
app.use('/api/roommates', roommateRoutes);

// ── 404 + Global error handler (must be last) ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));