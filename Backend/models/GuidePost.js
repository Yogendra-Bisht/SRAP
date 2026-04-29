const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestName: {
      type: String,
      maxlength: 50,
    },
  },
  { timestamps: true }
);

const guidePostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['General', 'Hospitals', 'Canteens', 'Pharmacy', 'Cafes', 'Study Spots'],
      default: 'General',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestName: {
      type: String,
      maxlength: 50,
    },
    likes: [
      {
        type: String, // Can store ObjectId or Guest Device ID
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('GuidePost', guidePostSchema);
