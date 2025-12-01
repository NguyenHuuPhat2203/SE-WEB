const contestService = require('../services/contestService');

exports.list = (req, res) => {
  const contests = contestService.getAll();
  res.json({ success: true, data: contests });
};

exports.detail = (req, res) => {
  try {
    const contest = contestService.getById(req.params.id);
    res.json({ success: true, data: contest });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = (req, res) => {
  try {
    const contest = contestService.register(req.params.id);
    res.json({ success: true, data: contest });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    if (err.message === 'CONTEST_CLOSED') {
      return res.status(400).json({ success: false, message: 'Contest is closed' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
