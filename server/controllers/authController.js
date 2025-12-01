// controllers/authController.js
const authService = require('../services/authService');

exports.register = (req, res) => {
  console.log('[REGISTER] body =', req.body); // THÊM DÒNG NÀY
  try {
    const newUser = authService.register(req.body);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        bknetId: newUser.bknetId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (err.message === 'USER_EXISTS') {
      return res.status(409).json({ success: false, message: 'BKnetID already registered' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = (req, res) => {
  try {
    const user = authService.login(req.body);

    res.json({
      success: true,
      user: {
        id: user.id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing bknetId or password' });
    }
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.searchAccount = (req, res) => {
  try {
    authService.findAccount(req.body);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing bknetId' });
    }
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = (req, res) => {
  try {
    authService.resetPassword(req.body);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    if (err.message === 'INVALID_CAPTCHA') {
      return res.status(400).json({ success: false, message: 'Invalid CAPTCHA' });
    }
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
