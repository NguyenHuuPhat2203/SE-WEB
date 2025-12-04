const qaService = require('../services/qaService');

exports.list = async (req, res) => {
  try {
    const questions = await qaService.list(req.query);
    res.json({ success: true, data: questions });
  } catch (err) {
    console.error('Error listing questions:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.detail = async (req, res) => {
  try {
    const q = await qaService.getById(req.params.id);
    res.json({ success: true, data: q });
  } catch (err) {
    console.error('Error getting question detail:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    // TODO: Get userId from JWT token in middleware
    const questionData = { ...req.body, author: req.body.userId };
    const q = await qaService.create(questionData);
    res.status(201).json({ success: true, data: q });
  } catch (err) {
    console.error('Error creating question:', err);
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;
    
    if (!content || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const question = await qaService.addAnswer(id, { author: userId, content });
    res.json({ success: true, data: question });
  } catch (err) {
    console.error('Error adding answer:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
