const qaService = require('../services/qaService');

exports.list = (req, res) => {
  res.json({ success: true, data: qaService.list() });
};

exports.detail = (req, res) => {
  try {
    const q = qaService.getById(req.params.id);
    res.json({ success: true, data: q });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.create = (req, res) => {
  try {
    const q = qaService.create(req.body);
    res.status(201).json({ success: true, data: q });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
