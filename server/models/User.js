// models/User.js
class User {
  constructor({ id, bknetId, firstName, lastName, password, role, notifications=[], faculty = '',
    stuId = '',
    tutorId = '',
    department = '',
    listCourseCanTeach = [],
    education = [],
    awards = [],
    isProfileComplete = false}) {
    this.id = id;
    this.bknetId = bknetId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role || 'student';
    this.notifications = notifications;
    this.isProfileComplete = isProfileComplete
    this.department = department;
    this.stuId = stuId;
    this.tutorId = tutorId;
    this.faculty = faculty;
    this.listCourseCanTeach = listCourseCanTeach;
    this.education = education;
    this.awards = awards;
    this.notifications = notifications;
    this.isProfileComplete = isProfileComplete;
  }

  // Thêm thông báo mới (chuẩn FE)
  addNotification({ title, content, type, senderBknetId }) {
    const noti = {
      id: Date.now(),
      title,
      content, // ✅ nội dung thông báo
      type: type || 'system', // 'course' | 'consultation' | 'contest' | 'system'
      unread: true,
      senderBknetId: senderBknetId || null,
      time: new Date().toLocaleString(),
    };

    this.notifications.unshift(noti);
    return noti;
  }

  // Đánh dấu đã đọc
  markNotificationRead(notiId) {
    const noti = this.notifications.find((n) => n.id === notiId);
    if (noti) noti.unread = false;
  }

  // Xóa toàn bộ thông báo
  clearNotifications() {
    this.notifications = [];
  }

  updateProfileInfo(data) {
    if (this.role === 'student') {
      this.department = data.department || this.department;
      this.stuId = data.stuId || this.stuId;
    } else if (this.role === 'tutor') {
      this.tutorId = data.tutorId || this.tutorId;
      this.faculty = data.faculty || this.faculty;
      this.listCourseCanTeach = data.listCourseCanTeach || this.listCourseCanTeach;
      this.education = data.education || this.education;
      this.awards = data.awards || this.awards;
    }

    this.isProfileComplete = true;
  }
}

module.exports = User;
