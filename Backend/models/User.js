const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    role: {
      type: String,
      enum: ['student', 'landlord'],
      default: 'student',
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// ─── Hash password before saving ─────────────────────────────────────────────
// Note: Mongoose 7+ async pre hooks don't receive a next callback — just return
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: generate password reset token ──────────────────────────
const crypto = require('crypto');
userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  // Store hashed version in DB — only the raw token is emailed
  this.resetPasswordToken   = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  return token; // return raw (un-hashed) token for the email link
};

// ─── Instance method: compare entered password with hash ──────────────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
