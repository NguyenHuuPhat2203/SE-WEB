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
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
app.get('/api/contests', contestController.list);
app.get('/api/contests/:id', contestController.detail);
app.post('/api/contests/:id/register', contestController.register);

// Sessions
app.get('/api/sessions', sessionController.list);           // ?type=my|upcoming|ongoing
app.get('/api/sessions/:id', sessionController.detail);
app.post('/api/sessions/:id/join', sessionController.join);

// Tutors
app.get('/api/tutors', tutorController.list);
app.get('/api/tutors/departments', tutorController.departments);
app.get('/api/tutors/specializations', tutorController.specializations);
app.get('/api/tutors/suggestions', tutorController.suggestions);
app.get('/api/tutors/:id', tutorController.detail);

// Q&A
app.get('/api/questions', qaController.list);
app.post('/api/questions', qaController.create);
app.get('/api/questions/:id', qaController.detail);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
