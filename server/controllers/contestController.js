const contestService = require('../services/contestService');

exports.list = async (req, res) => {
  try {
    const contests = await contestService.getAll();
    res.json({ success: true, data: contests });
  } catch (err) {
    console.error('Error listing contests:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.detail = async (req, res) => {
  try {
    const contest = await contestService.getById(req.params.id);
    res.json({ success: true, data: contest });
  } catch (err) {
    console.error('Error getting contest detail:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    // TODO: Get userId from JWT token in middleware
    const userId = req.body.userId; // Temporary
    const contest = await contestService.register(req.params.id, userId);
    res.json({ success: true, data: contest });
  } catch (err) {
    console.error('Error registering for contest:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    if (err.message === 'CONTEST_CLOSED') {
      return res.status(400).json({ success: false, message: 'Contest is closed' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const userId = req.body.userId; // Tutor ID
    const contest = await contestService.create(req.body, userId);
    res.status(201).json({ success: true, data: contest });
  } catch (err) {
    console.error('Error creating contest:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addQuestions = async (req, res) => {
  try {
    const { questions } = req.body;
    const contest = await contestService.addQuestions(req.params.id, questions);
    res.json({ success: true, data: contest });
  } catch (err) {
    console.error('Error adding questions:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const result = await contestService.submitAnswers(req.params.id, userId, answers);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error submitting answers:', err);
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await contestService.getResults(req.params.id);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Error getting results:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getUserResult = async (req, res) => {
  try {
    const { userId } = req.query;
    const result = await contestService.getUserResult(req.params.id, userId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error getting user result:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
