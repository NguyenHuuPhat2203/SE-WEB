// models/Contest.js
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['academic', 'non-academic'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  period: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maxParticipants: {
    type: Number
  },
  prize: {
    type: String
  },
  rules: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contest', contestSchema);