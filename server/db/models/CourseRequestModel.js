// db/models/CourseRequestModel.js
const mongoose = require('mongoose');

const courseRequestSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  department: String,
  reason: String,
  requestedBy: {
    type: String,
    required: true,
  },
  requestedByName: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedBy: String,
  reviewedAt: Date,
  reviewNotes: String,
  
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

courseRequestSchema.index({ status: 1 });
courseRequestSchema.index({ createdAt: -1 });

const CourseRequestModel = mongoose.model('CourseRequest', courseRequestSchema);

module.exports = CourseRequestModel;
