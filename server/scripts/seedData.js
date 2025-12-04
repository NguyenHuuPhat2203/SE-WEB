// scripts/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Contest = require('../models/Contest');
const Session = require('../models/Session');
const Question = require('../models/Question');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Tutor.deleteMany({});
  await Contest.deleteMany({});
  await Session.deleteMany({});
  await Question.deleteMany({});
  console.log('✅ Database cleared');
};

const seedUsers = async () => {
  console.log('👥 Seeding users...');
  
  const usersData = [
    {
      bknetId: 'student',
      firstName: 'Demo',
      lastName: 'Student',
      password: 'password',
      role: 'student',
      email: 'student@hcmut.edu.vn'
    },
    {
      bknetId: 'tutor',
      firstName: 'Demo',
      lastName: 'Tutor',
      password: 'password',
      role: 'tutor',
      email: 'tutor@hcmut.edu.vn'
    },
    {
      bknetId: 'cod',
      firstName: 'Demo',
      lastName: 'CoD',
      password: 'password',
      role: 'cod',
      email: 'cod@hcmut.edu.vn'
    },
    {
      bknetId: 'ctsv',
      firstName: 'Demo',
      lastName: 'CTSV',
      password: 'password',
      role: 'ctsv',
      email: 'ctsv@hcmut.edu.vn'
    },
    // Additional tutors
    {
      bknetId: 'tutor.tran',
      firstName: 'Tran',
      lastName: 'Thi B',
      password: 'password',
      role: 'tutor',
      email: 'tran.b@hcmut.edu.vn'
    },
    {
      bknetId: 'tutor.nguyen',
      firstName: 'Nguyen',
      lastName: 'Van C',
      password: 'password',
      role: 'tutor',
      email: 'nguyen.c@hcmut.edu.vn'
    },
    {
      bknetId: 'tutor.le',
      firstName: 'Le',
      lastName: 'Thi D',
      password: 'password',
      role: 'tutor',
      email: 'le.d@hcmut.edu.vn'
    },
    // Additional students
    {
      bknetId: 'student.a',
      firstName: 'Student',
      lastName: 'A',
      password: 'password',
      role: 'student',
      email: 'student.a@hcmut.edu.vn'
    },
    {
      bknetId: 'student.b',
      firstName: 'Student',
      lastName: 'B',
      password: 'password',
      role: 'student',
      email: 'student.b@hcmut.edu.vn'
    }
  ];

  // Tạo từng user để trigger pre('save') middleware và hash password
  const createdUsers = [];
  for (const userData of usersData) {
    const user = new User(userData);
    await user.save(); // Trigger pre('save') middleware
    createdUsers.push(user);
  }
  
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

const seedTutors = async (users) => {
  console.log('👨‍🏫 Seeding tutors...');
  
  const tutorUsers = users.filter(u => u.role === 'tutor');
  
  const tutors = [
    {
      user: tutorUsers[0]._id,
      department: 'Computer Science',
      specialization: ['Data Structures', 'Algorithms', 'Programming'],
      bio: 'Experienced tutor with 5 years of teaching experience',
      experience: 5,
      rating: { average: 4.8, count: 24 },
      nextAvailable: new Date(Date.now() + 86400000), // Tomorrow
      status: 'active'
    },
    {
      user: tutorUsers[1]._id,
      department: 'Computer Science',
      specialization: ['Data Structures', 'Algorithms', 'Programming'],
      bio: 'Expert in data structures and algorithms',
      experience: 8,
      rating: { average: 4.8, count: 24 },
      nextAvailable: new Date(Date.now() + 86400000),
      status: 'active'
    },
    {
      user: tutorUsers[2]._id,
      department: 'Computer Science',
      specialization: ['Database', 'Web Development', 'Software Engineering'],
      bio: 'Full-stack developer and educator',
      experience: 6,
      rating: { average: 4.6, count: 18 },
      nextAvailable: new Date(),
      status: 'active'
    },
    {
      user: tutorUsers[3]._id,
      department: 'Computer Science',
      specialization: ['Machine Learning', 'AI', 'Data Science'],
      bio: 'AI researcher and data science mentor',
      experience: 10,
      rating: { average: 4.9, count: 32 },
      nextAvailable: new Date(Date.now() + 604800000), // Next week
      status: 'active'
    }
  ];

  const createdTutors = await Tutor.insertMany(tutors);
  console.log(`✅ Created ${createdTutors.length} tutors`);
  return createdTutors;
};

const seedContests = async (users) => {
  console.log('🏆 Seeding contests...');
  
  const organizer = users.find(u => u.role === 'tutor');
  
  const contests = [
    {
      title: 'Algorithm Challenge 2025',
      type: 'academic',
      description: 'Competitive programming contest focusing on algorithmic problem solving',
      period: {
        start: new Date('2025-12-20'),
        end: new Date('2025-12-25')
      },
      status: 'open',
      organizer: organizer._id,
      maxParticipants: 100,
      prize: '1st: $500, 2nd: $300, 3rd: $200'
    },
    {
      title: 'Hackathon: Smart City Solutions',
      type: 'non-academic',
      description: 'Build innovative solutions for smart cities using IoT and AI',
      period: {
        start: new Date('2026-01-10'),
        end: new Date('2026-01-15')
      },
      status: 'open',
      organizer: organizer._id,
      maxParticipants: 50,
      prize: 'Winner gets internship opportunity'
    },
    {
      title: 'Data Science Competition',
      type: 'academic',
      description: 'Machine learning and data analysis challenge',
      period: {
        start: new Date('2025-11-15'),
        end: new Date('2025-11-30')
      },
      status: 'closed',
      organizer: organizer._id
    }
  ];

  const createdContests = await Contest.insertMany(contests);
  console.log(`✅ Created ${createdContests.length} contests`);
  return createdContests;
};

const seedSessions = async (users, tutors) => {
  console.log('📅 Seeding sessions...');
  
  const sessions = [
    {
      title: 'Assembly programming guide',
      subject: 'Computer Architecture',
      tutor: tutors[0].user,
      date: new Date(Date.now() + 86400000), // Tomorrow
      duration: 60,
      maxParticipants: 20,
      status: 'upcoming',
      description: 'Learn the fundamentals of assembly programming',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      title: 'Sorting algorithms',
      subject: 'DSA',
      tutor: tutors[1].user,
      date: new Date(),
      duration: 90,
      maxParticipants: 25,
      status: 'ongoing',
      description: 'Deep dive into sorting algorithms and their complexities',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst'
    },
    {
      title: 'How to build a semantic checker',
      subject: 'PPL',
      tutor: tutors[0].user,
      date: new Date(Date.now() + 432000000), // 5 days
      duration: 120,
      maxParticipants: 15,
      status: 'upcoming',
      description: 'Build a semantic checker for a programming language',
      rating: { average: 4.9, count: 10 }
    },
    {
      title: 'Operating Systems Concepts',
      subject: 'Operating Systems',
      tutor: tutors[2].user,
      date: new Date(Date.now() + 518400000), // 6 days
      duration: 60,
      maxParticipants: 30,
      status: 'upcoming',
      description: 'Understanding process management and scheduling',
      rating: { average: 4.7, count: 15 }
    },
    {
      title: 'Database Design Best Practices',
      subject: 'Database Systems',
      tutor: tutors[2].user,
      date: new Date(Date.now() + 691200000), // 8 days
      duration: 90,
      maxParticipants: 20,
      status: 'upcoming',
      description: 'Learn normalization and database optimization techniques',
      rating: { average: 4.8, count: 12 }
    }
  ];

  const createdSessions = await Session.insertMany(sessions);
  console.log(`✅ Created ${createdSessions.length} sessions`);
  return createdSessions;
};

const seedQuestions = async (users) => {
  console.log('❓ Seeding questions...');
  
  const students = users.filter(u => u.role === 'student');
  const tutors = users.filter(u => u.role === 'tutor');
  
  const questions = [
    {
      title: 'How to implement Binary Search Tree?',
      content: 'I am having trouble implementing a BST in C++. Can someone explain the insertion and deletion operations?',
      author: students[0]._id,
      topic: 'Data Structures',
      tags: ['BST', 'Trees', 'C++'],
      status: 'answered',
      answers: [
        {
          author: tutors[0]._id,
          content: 'Here is a step-by-step explanation of BST operations...',
          isAccepted: true,
          upvotes: 5
        },
        {
          author: tutors[1]._id,
          content: 'You can also consider using the STL map for simpler implementation...',
          upvotes: 2
        }
      ],
      views: 45,
      upvotes: 8
    },
    {
      title: 'Explain Dynamic Programming approach',
      content: 'What is the best way to identify if a problem can be solved using DP?',
      author: students[1]._id,
      topic: 'Algorithms',
      tags: ['DP', 'Optimization'],
      status: 'answered',
      answers: [
        {
          author: tutors[0]._id,
          content: 'Look for optimal substructure and overlapping subproblems...',
          isAccepted: true,
          upvotes: 10
        }
      ],
      views: 67,
      upvotes: 12
    },
    {
      title: 'Database normalization best practices?',
      content: 'When should I normalize to 3NF vs BCNF? What are the trade-offs?',
      author: students[2]._id,
      topic: 'Database',
      tags: ['SQL', 'Normalization', 'Design'],
      status: 'unanswered',
      views: 23,
      upvotes: 3
    }
  ];

  const createdQuestions = await Question.insertMany(questions);
  console.log(`✅ Created ${createdQuestions.length} questions`);
  return createdQuestions;
};

const seedAll = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const tutors = await seedTutors(users);
    const contests = await seedContests(users);
    const sessions = await seedSessions(users, tutors);
    const questions = await seedQuestions(users);
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Tutors: ${tutors.length}`);
    console.log(`   Contests: ${contests.length}`);
    console.log(`   Sessions: ${sessions.length}`);
    console.log(`   Questions: ${questions.length}`);
    console.log('\n🔐 Demo accounts:');
    console.log('   Student: bknetId=student, password=password');
    console.log('   Tutor: bknetId=tutor, password=password');
    console.log('   CoD: bknetId=cod, password=password');
    console.log('   CTSV: bknetId=ctsv, password=password');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedAll();
