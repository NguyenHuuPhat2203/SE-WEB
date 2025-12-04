const tutorService = require('../services/tutorService');

exports.list = async (req, res) => {
  try {
    const tutors = await tutorService.list();
    res.json({ success: true, data: tutors });
  } catch (err) {
    console.error('Error listing tutors:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.detail = async (req, res) => {
  try {
    const tutor = await tutorService.getById(req.params.id);
    res.json({ success: true, data: tutor });
  } catch (err) {
    console.error('Error getting tutor detail:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.suggestions = async (req, res) => {
  try {
    const userId = req.query.userId; // TODO: Get from JWT
    const tutors = await tutorService.suggestions(userId);
    res.json({ success: true, data: tutors });
  } catch (err) {
    console.error('Error getting tutor suggestions:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.departments = async (req, res) => {
  try {
    const departments = await tutorService.departments();
    res.json({ success: true, data: departments });
  } catch (err) {
    console.error('Error getting departments:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.specializations = async (req, res) => {
  try {
    const specializations = await tutorService.specializations();
    res.json({ success: true, data: specializations });
  } catch (err) {
    console.error('Error getting specializations:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
