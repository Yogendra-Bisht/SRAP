const mongoose = require('mongoose');

const roommateProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One profile per user
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    lookingForGender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    budgetMin: {
      type: Number,
      required: true,
      default: 0,
    },
    budgetMax: {
      type: Number,
      required: true,
    },
    // ML Features (encoded as 0 or 1, or scaled later)
    smoking: {
      type: Boolean,
      default: false,
    },
    drinking: {
      type: Boolean,
      default: false,
    },
    sleepingHabits: {
      type: String,
      enum: ['Early Bird', 'Night Owl', 'Flexible'],
      default: 'Flexible',
    },
    cleanliness: {
      type: String,
      enum: ['Messy', 'Average', 'Very Clean'],
      default: 'Average',
    },
    bio: {
      type: String,
      maxLength: 500,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoommateProfile', roommateProfileSchema);
