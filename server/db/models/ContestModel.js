// db/models/ContestModel.js
const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['academic', 'non-academic'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'upcoming'],
    default: 'open',
  },
  participants: {
    type: Number,
    default: 0,
  },
  maxParticipants: {
    type: Number,
    default: 100,
  },
  location: String,
  organizer: String,
  startDate: String,
  endDate: String,
  rules: [String],
  prizes: [String],
  
  // Array of registered user IDs
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

contestSchema.index({ type: 1, status: 1 });

const ContestModel = mongoose.model('Contest', contestSchema);

module.exports = ContestModel;
