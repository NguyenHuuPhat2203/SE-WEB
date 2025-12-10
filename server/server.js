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

const express = require("express");
const cors = require("cors");
const config = require("./utils/config");
const { connectDB } = require("./db/mongoose");
const { protect, authorize } = require("./middleware/auth");

// Controllers
const authController = require("./controllers/authController");
const contestController = require("./controllers/contestController");
const sessionController = require("./controllers/sessionController");
const tutorController = require("./controllers/tutorController");
const qaController = require("./controllers/qaController");
const userController = require("./controllers/userController");
const notificationController = require("./controllers/notificationController");
const courseRequestController = require("./controllers/courseRequestController");

const app = express();
const PORT = config.port;

// Middleware
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (development only)
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes (public)
app.post("/api/login", authController.login);
app.post("/api/register", authController.register);
app.post("/api/password/search", authController.searchAccount);
app.post("/api/password/reset", authController.resetPassword);

// User routes (protected)
app.get("/api/me", protect, userController.getCurrentUser);
app.patch("/api/users/:bknetId/profile", protect, userController.updateProfile);

// DEBUG: xem user trong database (development only)
if (config.nodeEnv === "development") {
  const userRepositoryMongo = require("./repositories/userRepositoryMongo");
  app.get("/api/users", async (req, res) => {
    try {
      const users = await userRepositoryMongo.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

// Contests
app.get("/api/contests", (req, res) => contestController.list(req, res));
app.get("/api/contests/:id", (req, res) => contestController.detail(req, res));
app.post("/api/contests/:id/register", (req, res) =>
  contestController.register(req, res)
);
app.post("/api/addcontest", (req, res) => contestController.create(req, res));

// Sessions
app.get("/api/sessions", (req, res) => sessionController.list(req, res));
app.get("/api/sessions/:id", (req, res) => sessionController.detail(req, res));
app.post("/api/sessions/:id/join", (req, res) =>
  sessionController.join(req, res)
);
app.post("/api/addsession", (req, res) => sessionController.create(req, res));

// Tutors
app.get("/api/tutors", (req, res) => tutorController.list(req, res));
app.get("/api/tutors/departments", (req, res) =>
  tutorController.departments(req, res)
);
app.get("/api/tutors/specializations", (req, res) =>
  tutorController.specializations(req, res)
);
app.get("/api/tutors/suggestions", (req, res) =>
  tutorController.suggestions(req, res)
);
app.get("/api/tutors/:id", (req, res) => tutorController.detail(req, res));

// Q&A
app.get("/api/getquestions", (req, res) => qaController.list(req, res));
app.post("/api/addquestion", (req, res) => qaController.create(req, res));
app.get("/api/questions/:id", (req, res) => qaController.detail(req, res));
app.post("/api/questions/:id/answers", (req, res) =>
  qaController.createAnswer(req, res)
);
// Notifications (protected)
app.get("/api/notifications", protect, (req, res) =>
  notificationController.list(req, res)
);
app.post("/api/addnotification", protect, (req, res) =>
  notificationController.create(req, res)
);
app.patch("/api/notifications/:id/read", protect, (req, res) =>
  notificationController.markRead(req, res)
);

// ---- Course ---- (protected)
app.get("/api/courses", courseRequestController.listCourses);
app.post(
  "/api/courses",
  protect,
  authorize("cod"),
  courseRequestController.addCourse
);
app.put(
  "/api/courses/:id",
  protect,
  authorize("cod"),
  courseRequestController.updateCourse
);
app.delete(
  "/api/courses/:id",
  protect,
  authorize("cod"),
  courseRequestController.deleteCourse
);

// ---- Course Requests ----
app.get("/api/course-requests", protect, courseRequestController.listRequests);
app.post(
  "/api/addcourse-request",
  protect,
  courseRequestController.createRequest
);
app.patch(
  "/api/course-requests/:id/approve",
  protect,
  authorize("cod"),
  courseRequestController.approveRequest
);
app.patch(
  "/api/course-requests/:id/reject",
  protect,
  authorize("cod"),
  courseRequestController.rejectRequest
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server with MongoDB connection
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🔐 CORS enabled for: ${config.corsOrigin}`);
      console.log(`💾 MongoDB: ${config.mongodbUri}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
