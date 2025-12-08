// db/models/index.js - Export all models
const UserModel = require('./UserModel');
const TutorModel = require('./TutorModel');
const ContestModel = require('./ContestModel');
const SessionModel = require('./SessionModel');
const QuestionModel = require('./QuestionModel');
const CourseModel = require('./CourseModel');
const CourseRequestModel = require('./CourseRequestModel');

module.exports = {
  UserModel,
  TutorModel,
  ContestModel,
  SessionModel,
  QuestionModel,
  CourseModel,
  CourseRequestModel,
};
