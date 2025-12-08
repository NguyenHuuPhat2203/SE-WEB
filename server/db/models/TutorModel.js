// db/models/TutorModel.js
const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  tutorId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  availability: {
    type: String,
    default: 'Available',
  },
  email: String,
  phone: String,
  bio: String,
  courses: [String],
  
  // Link to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

tutorSchema.index({ department: 1, specialization: 1 });

const TutorModel = mongoose.model('Tutor', tutorSchema);

module.exports = TutorModel;
