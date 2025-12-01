// repositories/userRepository.js
const User = require('../models/User');

let users = [
  new User({
    id: 1,
    bknetId: 'student',
    firstName: 'Demo',
    lastName: 'Student',
    password: 'password',
    role: 'student',
  }),
  new User({
    id: 2,
    bknetId: 'tutor',
    firstName: 'Demo',
    lastName: 'Tutor',
    password: 'password',
    role: 'tutor',
  }),
  new User({
    id: 3,
    bknetId: 'cod',
    firstName: 'Demo',
    lastName: 'Tutor',
    password: 'password',
    role: 'cod',
  }),
  new User({
    id: 4,
    bknetId: 'ctsv',
    firstName: 'Demo',
    lastName: 'Tutor',
    password: 'password',
    role: 'ctsv',
  }),
];

class UserRepository {
  findByBknetId(bknetId) {
    return users.find((u) => u.bknetId === bknetId) || null;
  }

  create(userData) {
    const user = new User({
      id: users.length + 1,
      ...userData,
    });
    users.push(user);
    return user;
  }

  getAll() {
    return users;
  }
  updatePassword(bknetId, newPassword) {
    const user = this.findByBknetId(bknetId);
    if (!user) return null;
    user.password = newPassword;
    return user;
  }

}

module.exports = new UserRepository();
