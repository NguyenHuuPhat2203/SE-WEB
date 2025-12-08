// scripts/seed.js - Database seeder
require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../db/mongoose");
const {
  UserModel,
  TutorModel,
  ContestModel,
  SessionModel,
  QuestionModel,
} = require("../db/models");

// Demo data
const users = [
  {
    bknetId: "student",
    firstName: "Demo",
    lastName: "Student",
    password: "password",
    role: "student",
    department: "Computer Science",
    stuId: "ST001",
  },
  {
    bknetId: "tutor",
    firstName: "Demo",
    lastName: "Tutor",
    password: "password",
    role: "tutor",
    tutorId: "T001",
    faculty: "Engineering",
    department: "Computer Science",
    listCourseCanTeach: ["Data Structures", "Algorithms", "Database Systems"],
    education: ["PhD Computer Science"],
    awards: ["Best Teacher Award 2024"],
  },
  {
    bknetId: "cod",
    firstName: "Demo",
    lastName: "CoD",
    password: "password",
    role: "cod",
    department: "Computer Science",
  },
  {
    bknetId: "ctsv",
    firstName: "Demo",
    lastName: "CTSV",
    password: "password",
    role: "ctsv",
  },
];

const tutors = [
  {
    tutorId: "T001",
    name: "Dr. Nguyen Van A",
    department: "Computer Science",
    specialization: "Data Structures & Algorithms",
    rating: 4.8,
    reviewCount: 124,
    availability: "Available",
    email: "nguyenvana@hcmut.edu.vn",
    bio: "Expert in algorithms and data structures with 10 years of teaching experience.",
    courses: ["Data Structures", "Algorithms", "Advanced Programming"],
  },
  {
    tutorId: "T002",
    name: "Dr. Tran Thi B",
    department: "Mathematics",
    specialization: "Calculus & Linear Algebra",
    rating: 4.9,
    reviewCount: 98,
    availability: "Busy",
    email: "tranthib@hcmut.edu.vn",
    bio: "Mathematics professor specializing in calculus and linear algebra.",
    courses: ["Calculus I", "Calculus II", "Linear Algebra"],
  },
  {
    tutorId: "T003",
    name: "MSc. Le Van C",
    department: "Physics",
    specialization: "Quantum Mechanics",
    rating: 4.7,
    reviewCount: 56,
    availability: "Available",
    email: "levanc@hcmut.edu.vn",
    bio: "Physics lecturer with focus on quantum mechanics and modern physics.",
    courses: ["Physics I", "Physics II", "Quantum Mechanics"],
  },
];

const contests = [
  {
    title: "Algorithm Challenge 2025",
    type: "academic",
    description: "Competitive programming contest for HCMUT students.",
    status: "open",
    participants: 0,
    maxParticipants: 100,
    location: "Online",
    organizer: "Computer Science Dept.",
    startDate: "Dec 15, 2025 - 9:00 AM",
    endDate: "Dec 25, 2025 - 5:00 PM",
    rules: [
      "Individual participation only.",
      "No external libraries allowed.",
      "Time limit: 3 hours",
    ],
    prizes: ["1st Place: $500", "2nd Place: $300", "3rd Place: $200"],
  },
  {
    title: "Hackathon: Smart City Solutions",
    type: "non-academic",
    description: "Build innovative solutions for smart cities.",
    status: "open",
    participants: 0,
    maxParticipants: 80,
    location: "HCMUT Innovation Hub",
    organizer: "Innovation Lab",
    startDate: "Jan 10, 2026 - 8:00 AM",
    endDate: "Jan 15, 2026 - 6:00 PM",
    rules: ["Teams of 3-5 members.", "Must use provided API."],
    prizes: ["Winner: $1000 + Internship opportunity"],
  },
  {
    title: "Data Science Competition",
    type: "academic",
    description: "Machine learning and data analysis challenge.",
    status: "open",
    participants: 0,
    maxParticipants: 100,
    location: "Online",
    organizer: "AI Lab",
    startDate: "Dec 20, 2025 - 10:00 AM",
    endDate: "Dec 30, 2025 - 11:59 PM",
    rules: ["Individual or team max 3 members.", "Dataset provided."],
    prizes: ["1st: $800", "2nd: $500", "3rd: $300"],
  },
];

const sessions = [
  {
    title: "Data Structures - Binary Trees",
    tutor: "Dr. Nguyen Van A",
    type: "online",
    date: "Dec 12, 2025",
    time: "14:00",
    duration: "2 hours",
    location: "Zoom Meeting",
    capacity: 20,
    currentStudents: 0,
    status: "scheduled",
    description: "Deep dive into binary trees and tree traversal algorithms.",
    students: [],
  },
  {
    title: "Calculus Office Hours",
    tutor: "Dr. Tran Thi B",
    type: "offline",
    date: "Dec 13, 2025",
    time: "10:00",
    duration: "1 hour",
    location: "Room H1-201",
    capacity: 10,
    currentStudents: 0,
    status: "scheduled",
    description: "Q&A session for Calculus II students.",
    students: [],
  },
  {
    title: "Group Study: Quantum Physics",
    tutor: "MSc. Le Van C",
    type: "group",
    date: "Dec 14, 2025",
    time: "16:00",
    duration: "3 hours",
    location: "Library Study Room 3",
    capacity: 15,
    currentStudents: 0,
    status: "scheduled",
    description: "Collaborative study session on quantum mechanics.",
    students: [],
  },
];

const questions = [
  {
    title: "How to implement Binary Search Tree?",
    content:
      "I am struggling with the implementation of BST insert method. Can someone explain the recursive approach?",
    author: "student",
    topic: "Data Structures",
    tags: ["BST", "Trees", "Recursion"],
    answers: [
      {
        author: "tutor",
        content:
          "The recursive approach compares the value with the current node and recursively inserts into left or right subtree.",
        isTutor: true,
        likes: 5,
      },
    ],
    views: 45,
    likes: 8,
  },
  {
    title: "Difference between Array and LinkedList?",
    content:
      "What are the main differences in terms of performance and use cases?",
    author: "student",
    topic: "Data Structures",
    tags: ["Array", "LinkedList", "Performance"],
    answers: [],
    views: 23,
    likes: 3,
  },
  {
    title: "Understanding Big O Notation",
    content: "Can someone explain how to calculate time complexity?",
    author: "student",
    topic: "Algorithms",
    tags: ["BigO", "Complexity", "Analysis"],
    answers: [
      {
        author: "tutor",
        content:
          "Big O describes the worst-case scenario. Count the number of operations relative to input size.",
        isTutor: true,
        likes: 12,
      },
      {
        author: "student",
        content: "Also consider space complexity for memory usage!",
        isTutor: false,
        likes: 3,
      },
    ],
    views: 89,
    likes: 15,
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      UserModel.deleteMany({}),
      TutorModel.deleteMany({}),
      ContestModel.deleteMany({}),
      SessionModel.deleteMany({}),
      QuestionModel.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared\n");

    // Seed users
    console.log("👥 Seeding users...");
    const createdUsers = await UserModel.create(users);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Seed tutors
    console.log("👨‍🏫 Seeding tutors...");
    const tutorUser = createdUsers.find((u) => u.bknetId === "tutor");
    if (tutorUser) {
      tutors[0].userId = tutorUser._id;
    }
    const createdTutors = await TutorModel.insertMany(tutors);
    console.log(`✅ Created ${createdTutors.length} tutors\n`);

    // Seed contests
    console.log("🏆 Seeding contests...");
    const createdContests = await ContestModel.insertMany(contests);
    console.log(`✅ Created ${createdContests.length} contests\n`);

    // Seed sessions
    console.log("📅 Seeding sessions...");
    if (tutorUser) {
      sessions.forEach((s) => (s.tutorId = tutorUser._id));
    }
    const createdSessions = await SessionModel.insertMany(sessions);
    console.log(`✅ Created ${createdSessions.length} sessions\n`);

    // Seed questions
    console.log("❓ Seeding questions...");
    const studentUser = createdUsers.find((u) => u.bknetId === "student");
    if (studentUser && tutorUser) {
      questions.forEach((q) => {
        q.authorId = studentUser._id;
        q.answers.forEach((a) => {
          a.authorId = a.isTutor ? tutorUser._id : studentUser._id;
        });
      });
    }
    const createdQuestions = await QuestionModel.insertMany(questions);
    console.log(`✅ Created ${createdQuestions.length} questions\n`);

    // Add demo notifications
    console.log("🔔 Adding demo notifications...");
    const student = await UserModel.findOne({ bknetId: "student" });
    if (student) {
      student.addNotification({
        title: "Welcome to the Platform!",
        content: "Start exploring courses and tutors.",
        type: "system",
      });
      student.addNotification({
        title: "New Contest Available",
        content: "Algorithm Challenge 2025 is now open for registration!",
        type: "contest",
        senderBknetId: "cod",
      });
      await student.save();
    }
    console.log("✅ Demo notifications added\n");

    console.log("✨ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Tutors: ${createdTutors.length}`);
    console.log(`   Contests: ${createdContests.length}`);
    console.log(`   Sessions: ${createdSessions.length}`);
    console.log(`   Questions: ${createdQuestions.length}`);
    console.log("\n🔑 Demo credentials:");
    console.log("   Student: student / password");
    console.log("   Tutor: tutor / password");
    console.log("   CoD: cod / password");
    console.log("   CTSV: ctsv / password\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

// Run seeder
if (require.main === module) {
  seed();
}

module.exports = { seed };
