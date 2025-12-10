// MongoDB initialization script for Docker
db = db.getSiblingDB("se-web-tutoring");

// Create collections
db.createCollection("users");
db.createCollection("tutors");
db.createCollection("contests");
db.createCollection("sessions");
db.createCollection("questions");

// Create indexes
db.users.createIndex({ bknetId: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.tutors.createIndex({ userId: 1 });
db.contests.createIndex({ status: 1 });
db.sessions.createIndex({ tutorId: 1 });
db.questions.createIndex({ authorId: 1 });

print("✅ Database initialized successfully");
