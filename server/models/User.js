// models/User.js
class User {
  constructor({ id, bknetId, firstName, lastName, password, role }) {
    this.id = id;
    this.bknetId = bknetId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role || 'student';
  }
}

module.exports = User;
