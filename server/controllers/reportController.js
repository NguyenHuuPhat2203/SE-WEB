const { SessionModel, FeedbackModel, ContestModel, UserModel } = require("../db/models");

exports.getStats = async (req, res) => {
  try {
    // 1. Session Stats
    const totalSessions = await SessionModel.countDocuments();
    const completedSessions = await SessionModel.countDocuments({ status: "completed" });
    
    // 2. Feedback/Rating Stats
    const feedbacks = await FeedbackModel.find();
    const avgRating = feedbacks.length 
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;

    // 3. User Stats
    const totalStudents = await UserModel.countDocuments({ role: "student" });
    const totalTutors = await UserModel.countDocuments({ role: "tutor" });

    // 4. Contest Stats
    const openContests = await ContestModel.countDocuments({ status: "open" });

    // 5. Chart Data: Sessions by Status (for Pie Chart)
    const sessionsByStatus = await SessionModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSessions,
          completedSessions,
          completionRate: totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0,
          avgRating,
          totalStudents,
          totalTutors,
          openContests,
        },
        charts: {
          sessionsByStatus,
        }
      }
    });

  } catch (error) {
    console.error("Report stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
