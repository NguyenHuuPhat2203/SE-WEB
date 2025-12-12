const tutorService = require('../services/tutorService');

exports.list = (req, res) => {
  const tutors = tutorService.list();
  res.json({ success: true, data: tutors });
};

exports.detail = (req, res) => {
  try {
    const tutor = tutorService.getById(req.params.id);
    res.json({ success: true, data: tutor });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.suggestions = (req, res) => {
  const tutors = tutorService.suggestions(req.query.name);
  res.json({ success: true, data: tutors });
};

exports.departments = (req, res) => {
  res.json({ success: true, data: tutorService.departments() });
};

exports.specializations = (req, res) => {
  res.json({ success: true, data: tutorService.specializations() });
};
