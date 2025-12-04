const sessionService = require('../services/sessionService');

exports.list = async (req, res) => {
  try {
    const type = req.query.type || undefined;
    // TODO: Get userId from JWT token in middleware
    const userId = req.query.userId; // Temporary
    const sessions = await sessionService.list(type, userId);
    res.json({ success: true, data: sessions });
  } catch (err) {
    console.error('Error listing sessions:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.detail = async (req, res) => {
  try {
    const session = await sessionService.getById(req.params.id);
    res.json({ success: true, data: session });
  } catch (err) {
    console.error('Error getting session detail:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.join = async (req, res) => {
  try {
    // TODO: Get userId from JWT token in middleware
    const userId = req.body.userId; // Temporary
    const session = await sessionService.join(req.params.id, userId);
    res.json({ success: true, data: session });
  } catch (err) {
    console.error('Error joining session:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    if (err.message === 'FULL') {
      return res.status(400).json({ success: false, message: 'Session is full' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
