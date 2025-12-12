const { FeedbackModel, SessionModel, TutorModel, UserModel } = require("../db/models");

exports.create = async (req, res) => {
  try {
    const { sessionId, rating, comment, tutorId } = req.body;
    const studentId = req.user._id;

    // Verify session exists and belongs to student
    const session = await SessionModel.findOne({
      _id: sessionId,
      "students.userId": studentId, 
      status: "completed", 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found or not completed/eligible for feedback.",
      });
    }

    // Check if feedback already exists
    const existing = await FeedbackModel.findOne({ sessionId, studentId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this session.",
      });
    }

    // Create feedback
    const feedback = await FeedbackModel.create({
      sessionId,
      studentId,
      tutorId,
      rating,
      comment,
    });

    // Update Tutor Aggregated Rating
    const feedbacks = await FeedbackModel.find({ tutorId });
    const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const avgRating = totalRating / feedbacks.length;

    await TutorModel.findOneAndUpdate(
      { userId: tutorId },
      { rating: avgRating.toFixed(1), reviewCount: feedbacks.length }
    );

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error("Create feedback error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const feedbacks = await FeedbackModel.find({ tutorId })
      .populate("studentId", "firstName lastName")
      .populate("sessionId", "title date")
      .sort("-createdAt");

    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
