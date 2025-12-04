// services/authService.js
const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

class AuthService {
  async register({ firstName, lastName, bknetId, password, role, email }) {
    if (!firstName || !lastName || !bknetId || !password) {
      throw new Error('MISSING_FIELDS');
    }

    const existing = await userRepository.findByBknetId(bknetId);
    if (existing) {
      throw new Error('USER_EXISTS');
    }

    const newUser = await userRepository.create({
      firstName,
      lastName,
      bknetId,
      password,
      role: role || 'student',
      email
    });

    // Generate JWT token
    const token = this.generateToken(newUser);

    return { user: newUser, token };
  }

  async login({ bknetId, password }) {
    if (!bknetId || !password) {
      throw new Error('MISSING_FIELDS');
    }

    const user = await userRepository.findByBknetId(bknetId);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Use the comparePassword method from User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return { user, token };
  }

  async findAccount({ bknetId }) {
    if (!bknetId) throw new Error('MISSING_FIELDS');
    const user = await userRepository.findByBknetId(bknetId);
    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  async resetPassword({ bknetId, captcha, newPassword }) {
    if (!bknetId || !captcha || !newPassword) {
      throw new Error('MISSING_FIELDS');
    }

    // demo: captcha cố định CAPTCHA
    if (captcha !== 'CAPTCHA') {
      throw new Error('INVALID_CAPTCHA');
    }

    const user = await userRepository.updatePassword(bknetId, newPassword);
    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        bknetId: user.bknetId, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('INVALID_TOKEN');
    }
  }
}

module.exports = new AuthService();
