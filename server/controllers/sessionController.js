const sessionService = require('../services/sessionService');

exports.list = (req, res) => {
  const type = req.query.type || undefined;
  const sessions = sessionService.list(type);
  res.json({ success: true, data: sessions });
};

exports.detail = (req, res) => {
  try {
    const session = sessionService.getById(req.params.id);
    res.json({ success: true, data: session });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.join = (req, res) => {
  try {
    const session = sessionService.join(req.params.id);
    res.json({ success: true, data: session });
  } catch (err) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    if (err.message === 'FULL') {
      return res.status(400).json({ success: false, message: 'Session is full' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
