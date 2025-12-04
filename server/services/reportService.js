const User = require('../models/User');
const Session = require('../models/Session');
const Contest = require('../models/Contest');
const Question = require('../models/Question');

exports.getStudentActivityReport = async (semester, department) => {
  try {
    // Get all students
    const query = { role: 'student' };
    if (department && department !== 'all') {
      query.department = department;
    }

    const students = await User.find(query).lean();
    
    // Get activity data for each student
    const studentsWithActivity = await Promise.all(students.map(async (student) => {
      // Count sessions participated
      const sessionsCount = await Session.countDocuments({
        'participants': student._id
      });

      // Count contests participated
      const contestsCount = await Contest.countDocuments({
        'participants': student._id
      });

      // Count questions asked
      const questionsCount = await Question.countDocuments({
        userId: student._id
      });

      // Calculate average evaluation from session feedbacks
      const sessionsWithFeedback = await Session.find({
        'feedbacks.userId': student._id
      }).select('feedbacks');

      let totalRating = 0;
      let ratingCount = 0;
      sessionsWithFeedback.forEach(session => {
        const feedback = session.feedbacks.find(f => f.userId.toString() === student._id.toString());
        if (feedback && feedback.rating) {
          totalRating += feedback.rating;
          ratingCount++;
        }
      });

      const avgEval = ratingCount > 0 ? (totalRating / ratingCount) : 0;

      // Calculate activity score (custom formula)
      const activityScore = Math.min(100, 
        (sessionsCount * 5) + 
        (contestsCount * 10) + 
        (questionsCount * 3) + 
        (avgEval * 10)
      );

      return {
        id: student._id,
        name: student.fullName,
        studentId: student.studentId || 'N/A',
        email: student.email,
        department: student.department,
        consultations: sessionsCount,
        contests: contestsCount,
        questions: questionsCount,
        avgEval: parseFloat(avgEval.toFixed(2)),
        activityScore: Math.round(activityScore)
      };
    }));

    // Sort by activity score descending
    studentsWithActivity.sort((a, b) => b.activityScore - a.activityScore);

    return {
      success: true,
      data: studentsWithActivity,
      semester: semester || 'All',
      department: department || 'All'
    };
  } catch (error) {
    console.error('Error in getStudentActivityReport:', error);
    throw error;
  }
};

exports.getCourseStatistics = async () => {
  try {
    // Get all tutors and their sessions
    const sessions = await Session.find()
      .populate('tutorId', 'fullName')
      .lean();

    // Group by subject
    const courseStats = {};
    sessions.forEach(session => {
      const subject = session.subject || 'Other';
      if (!courseStats[subject]) {
        courseStats[subject] = {
          subject,
          sessionsCount: 0,
          totalParticipants: 0,
          tutorsSet: new Set()
        };
      }
      courseStats[subject].sessionsCount++;
      courseStats[subject].totalParticipants += session.participants?.length || 0;
      if (session.tutorId) {
        courseStats[subject].tutorsSet.add(session.tutorId._id.toString());
      }
    });

    // Convert to array and format
    const statsArray = Object.values(courseStats).map(stat => ({
      subject: stat.subject,
      sessions: stat.sessionsCount,
      participants: stat.totalParticipants,
      tutors: stat.tutorsSet.size
    }));

    return {
      success: true,
      data: statsArray
    };
  } catch (error) {
    console.error('Error in getCourseStatistics:', error);
    throw error;
  }
};
