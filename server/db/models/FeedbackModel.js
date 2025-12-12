const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate feedback for same session by same student
feedbackSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

module.exports = FeedbackModel;
