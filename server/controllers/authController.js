// controllers/authController.js
const authService = require('../services/authService');

exports.register = async (req, res) => {
  console.log('[REGISTER] body =', req.body);
  try {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (err.message === 'USER_EXISTS') {
      return res.status(409).json({ success: false, message: 'BKnetID already registered' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.json({
      success: true,
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing bknetId or password' });
    }
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.searchAccount = async (req, res) => {
  try {
    await authService.findAccount(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('Search account error:', err);
    if (err.message === 'MISSING_FIELDS') {
      return res.status(400).json({ success: false, message: 'Missing bknetId' });
    }
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
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
