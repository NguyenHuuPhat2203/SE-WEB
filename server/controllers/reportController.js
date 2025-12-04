const reportService = require('../services/reportService');

exports.studentActivity = async (req, res) => {
  try {
    const { semester, department } = req.query;
    const result = await reportService.getStudentActivityReport(semester, department);
    res.json(result);
  } catch (error) {
    console.error('Error in studentActivity:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate student activity report' 
    });
  }
};

exports.courseStatistics = async (req, res) => {
  try {
    const result = await reportService.getCourseStatistics();
    res.json(result);
  } catch (error) {
    console.error('Error in courseStatistics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get course statistics' 
    });
  }
};
