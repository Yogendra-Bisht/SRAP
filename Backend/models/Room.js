const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Room title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price per month is required'],
      min: [0, 'Price cannot be negative'],
    },
    location: {
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String },
      pincode: { type: String },
    },
    images: [
      {
        type: String, // URL strings (cloud storage or local path)
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          'WiFi',
          'AC',
          'Laundry',
          'Parking',
          'Meals',
          'Hot Water',
          'Power Backup',
          'CCTV',
          'Gym',
        ],
      },
    ],
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory', 'Studio'],
      required: [true, 'Room type is required'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Any'],
      default: 'Any',
    },
    availableFrom: {
      type: Date,
      required: [true, 'Availability start date is required'],
    },
    availableTo: {
      type: Date,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
