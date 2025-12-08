// db/models/CourseModel.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: String,
  credits: Number,
  description: String,
  prerequisite: String,
  instructor: String,
  schedule: String,
  capacity: Number,
  enrolled: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'full'],
    default: 'active',
  },
}, {
  timestamps: true,
});

const CourseModel = mongoose.model('Course', courseSchema);

module.exports = CourseModel;
