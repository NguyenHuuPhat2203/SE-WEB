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

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authController = require('./controllers/authController');
const userRepository = require('./repositories/userRepository');
const contestController = require('./controllers/contestController');
const sessionController = require('./controllers/sessionController');
const tutorController = require('./controllers/tutorController');
const qaController = require('./controllers/qaController');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tutor Support System API',
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post('/api/login', authController.login);
app.post('/api/register', authController.register);
app.post('/api/password/search', authController.searchAccount);
app.post('/api/password/reset', authController.resetPassword);

// DEBUG: xem user trong database
app.get('/api/users', async (req, res) => {
  try {
    const users = await userRepository.getAll();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
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
app.post('/api/questions/:id/answer', qaController.addAnswer);

// Reports (for COD and CTSV)
const reportController = require('./controllers/reportController');
app.get('/api/reports/student-activity', reportController.studentActivity);
app.get('/api/reports/course-statistics', reportController.courseStatistics);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`📊 MongoDB connection: ${process.env.MONGODB_URI || 'Not configured'}`);
});
