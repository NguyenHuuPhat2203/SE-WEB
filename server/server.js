// // server.js
// const express = require('express');
// const cors = require('cors');
// const authController = require('./controllers/authController');
// const userRepository = require('./repositories/userRepository');

// const app = express();
// const PORT = 3001;

// app.use(cors());
// app.use(express.json());

// // Auth routes
// app.post('/api/login', authController.login);
// app.post('/api/register', authController.register);

// // Debug: xem user (không trả password)
// app.get('/api/users', (req, res) => {
//   const users = userRepository.getAll().map(({ password, ...rest }) => rest);
//   res.json(users);
// });

// app.listen(PORT, () => {
//   console.log(`Backend running at http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const authController = require('./controllers/authController');
const userRepository = require('./repositories/userRepository');
// const passwordController = require('./controllers/passwordController');
const contestController = require('./controllers/contestController');
const sessionController = require('./controllers/sessionController');
const tutorController = require('./controllers/tutorController');
const qaController = require('./controllers/qaController');
const userController = require('./controllers/userController')
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.patch('/api/users/:bknetId/profile', userController.updateProfile);

app.post('/api/login', authController.login);
app.post('/api/register', authController.register);
app.post('/api/password/search', authController.searchAccount);
app.post('/api/password/reset', authController.resetPassword);


// DEBUG: xem user trong memory
app.get('/api/users', (req, res) => {
  const users = userRepository.getAll().map(({ password, ...rest }) => rest);
  res.json(users);
});

// Contests
app.get('/api/contests', (req, res) => contestController.list(req, res));
app.get('/api/contests/:id', (req, res) => contestController.detail(req, res));
app.post('/api/contests/:id/register', (req, res) => contestController.register(req, res));
app.post('/api/addcontest', (req, res) => contestController.create(req, res));


// Sessions
app.get('/api/sessions', (req, res) => sessionController.list(req, res));
app.get('/api/sessions/:id', (req, res) => sessionController.detail(req, res));
app.post('/api/sessions/:id/join', (req, res) => sessionController.join(req, res));
app.post('/api/addsession', (req, res) => sessionController.create(req, res));


// Tutors
app.get('/api/tutors', (req, res) => tutorController.list(req, res));
app.get('/api/tutors/departments', (req, res) => tutorController.departments(req, res));
app.get('/api/tutors/specializations', (req, res) => tutorController.specializations(req, res));
app.get('/api/tutors/suggestions', (req, res) => tutorController.suggestions(req, res));
app.get('/api/tutors/:id', (req, res) => tutorController.detail(req, res));

// Q&A
app.get('/api/getquestions', (req, res) => qaController.list(req, res));
app.post('/api/addquestion', (req, res) => qaController.create(req, res));
app.get('/api/questions/:id', (req, res) => qaController.detail(req, res));
app.post('/api/questions/:id/answers', (req, res) => qaController.createAnswer(req, res));

const notificationController = require('./controllers/notificationController');

app.get('/api/notifications', (req, res) => notificationController.list(req, res));
app.post('/api/addnotification', (req, res) => notificationController.create(req, res));
app.patch('/api/notifications/:id/read', (req, res) => notificationController.markRead(req, res));

const courseRequestController = require('./controllers/courseRequestController');

// ---- Course ----
app.get('/api/courses', courseRequestController.listCourses);
app.post('/api/courses', courseRequestController.addCourse);
app.put('/api/courses/:id', courseRequestController.updateCourse);
app.delete('/api/courses/:id', courseRequestController.deleteCourse);

// ---- Course Requests ----
app.get('/api/course-requests', courseRequestController.listRequests);
app.post('/api/addcourse-request', courseRequestController.createRequest); // ✅ NEW
app.patch('/api/course-requests/:id/approve', courseRequestController.approveRequest);
app.patch('/api/course-requests/:id/reject', courseRequestController.rejectRequest);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
