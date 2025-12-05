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

const student = users.find(u => u.bknetId === 'student');
if (student) {
  // unread notification
  student.addNotification({
    title: 'Test Notification - Unread',
    content: 'This is a test notification that is unread.',
    type: 'system',
    senderBknetId: 'tutor',
  });

  // read notification
  const readNoti = student.addNotification({
    title: 'Test Notification - Read',
    content: 'This is a test notification that has been read.',
    type: 'system',
    senderBknetId: 'tutor',
  });
  readNoti.unread = false;
}

const tutor = users.find(u => u.bknetId === 'tutor');
if (tutor) {
  // unread notification
  tutor.addNotification({
    title: 'Test Notification - Unread',
    content: 'This is a test notification that is unread.',
    type: 'system',
    senderBknetId: 'tutor',
  });

  // read notification
  const readNoti = tutor.addNotification({
    title: 'Test Notification - Read',
    content: 'This is a test notification that has been read.',
    type: 'system',
    senderBknetId: 'tutor',
  });
  readNoti.unread = false;
}

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

  addNotificationByBknetId(receiverBknetId, { title, content, type, senderBknetId }) {
    const receiver = this.findByBknetId(receiverBknetId);
    if (!receiver) {
      throw new Error(`USER_NOT_FOUND: ${receiverBknetId}`);
    }
    const noti = receiver.addNotification({
      title,
      content,
      type,
      senderBknetId,
    });
    return noti;
  }

  getNotificationsByBknetId(bknetId) {
    const user = this.findByBknetId(bknetId);
    return user.notifications;
  }

  markReadByBknetId(bknetId, notiId) {
    const user = this.findByBknetId(bknetId);
    user.markNotificationRead(notiId);
  }

  getUnreadCount(bknetId) {
    const user = this.findByBknetId(bknetId);
    return user.notifications.filter((n) => n.unread).length;
  }

  updateProfile(bknetId, data) {
    const user = this.findByBknetId(bknetId);
    if (!user) return null;
    user.updateProfileInfo(data);
    // console.log(user.isProfileComplete)
    return user;
  }

}

module.exports = new UserRepository();
