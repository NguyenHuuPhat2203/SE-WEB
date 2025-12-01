// services/authService.js
const userRepository = require('../repositories/userRepository');

class AuthService {
  register({ firstName, lastName, bknetId, password, role }) {
    if (!firstName || !lastName || !bknetId || !password) {
      throw new Error('MISSING_FIELDS');
    }

    const existing = userRepository.findByBknetId(bknetId);
    if (existing) {
      throw new Error('USER_EXISTS');
    }

    const newUser = userRepository.create({
      firstName,
      lastName,
      bknetId,
      password,
      role,
    });

    return newUser;
  }

  login({ bknetId, password }) {
    if (!bknetId || !password) {
      throw new Error('MISSING_FIELDS');
    }

    const user = userRepository.findByBknetId(bknetId);
    if (!user || user.password !== password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    return user;
  }
  findAccount({ bknetId }) {
  if (!bknetId) throw new Error('MISSING_FIELDS');
  const user = userRepository.findByBknetId(bknetId);
  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
}

resetPassword({ bknetId, captcha, newPassword }) {
  if (!bknetId || !captcha || !newPassword) {
    throw new Error('MISSING_FIELDS');
  }

  // demo: captcha cố định CAPTCHA
  if (captcha !== 'CAPTCHA') {
    throw new Error('INVALID_CAPTCHA');
  }

  const user = userRepository.updatePassword(bknetId, newPassword);
  if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

}

module.exports = new AuthService();
