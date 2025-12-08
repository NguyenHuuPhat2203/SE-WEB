// db/models/QuestionModel.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleString(),
  },
  likes: {
    type: Number,
    default: 0,
  },
  isTutor: {
    type: Boolean,
    default: false,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { _id: true });

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleString(),
  },
  topic: {
    type: String,
    required: true,
  },
  tags: [String],
  answers: [answerSchema],
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  
  // Author reference
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

questionSchema.index({ topic: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
