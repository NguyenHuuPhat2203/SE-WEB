// db/models/SessionModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  status: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tutor: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['online', 'offline', 'group'],
    default: 'online',
  },
  date: String,
  time: String,
  duration: String,
  location: String,
  capacity: {
    type: Number,
    default: 10,
  },
  currentStudents: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  description: String,
  
  // Students array
  students: [studentSchema],
  
  // Tutor reference
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

sessionSchema.index({ type: 1, status: 1 });
sessionSchema.index({ date: 1 });

const SessionModel = mongoose.model('Session', sessionSchema);

module.exports = SessionModel;
