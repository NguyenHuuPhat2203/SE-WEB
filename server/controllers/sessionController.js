// Hard-coded sessions
let sessions = [
  {
    id: 1,
    title: 'Data Structures - Binary Trees',
    date: 'Dec 20, 2025',
    time: '14:00 - 15:00',
    type: 'offline',
    location: 'Room A1-101',
    description: 'Introduction to binary trees and traversal techniques.',
    objectives: [
      'Understand binary tree structure',
      'Learn DFS & BFS traversal',
      'Practice coding tree operations'
    ],
    materials: ['Slides.pdf', 'BinaryTreeExamples.zip'],
    students: [
    ]
  },

  {
    id: 2,
    title: 'Algorithm Analysis',
    date: 'Dec 21, 2025',
    time: '10:00 - 11:30',
    type: 'online',
    location: 'https://teams.microsoft.com/meeting/algorithm-link',
    description: 'Deep dive into time complexity and recurrence relations.',
    objectives: [
      'Master Big-O notation',
      'Solve recurrence equations',
      'Analyze recursive algorithms'
    ],
    materials: ['ComplexityNotes.pdf'],
    students: [
    ]
  },

  {
    id: 3,
    title: 'Dynamic Programming Workshop',
    date: 'Dec 22, 2025',
    time: '15:00 - 16:00',
    type: 'offline',
    location: 'Room B2-205',
    description: 'Hands-on DP workshop: Knapsack, LIS, LCS.',
    objectives: [
      'Understand DP state definitions',
      'Practice classic DP problems',
      'Implement bottom-up and top-down DP'
    ],
    materials: ['DPProblems.pdf', 'Solutions.zip'],
    students: [
    ]
  },

  {
    id: 4,
    title: 'Operating Systems - Process Scheduling',
    date: 'Dec 23, 2025',
    time: '09:00 - 10:00',
    type: 'online',
    location: 'https://zoom.us/j/os-scheduling',
    description: 'Learn CPU scheduling algorithms and OS design concepts.',
    objectives: [
      'Understand FCFS, SJF, RR, Priority Scheduling',
      'Simulate scheduling algorithms',
      'Analyze process waiting & turnaround time'
    ],
    materials: ['SchedulingSlides.pdf'],
    students: []
  }
];

// GET /api/sessions
exports.list = (req, res) => {
  const type = req.query.type || undefined;
  let result = sessions;

  if (type) {
    result = sessions.filter(s => s.type === type);
  }

  res.json({ success: true, data: result });
};

// GET /api/sessions/:id
exports.detail = (req, res) => {
  const id = Number(req.params.id);
  const session = sessions.find(s => s.id === id);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  res.json({ success: true, data: session });
};


exports.join = (req, res) => {
  const id = Number(req.params.id);
  const session = sessions.find((s) => s.id === id);

  if (!session) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  // Lấy user từ request body
  const { id: userId, name, status } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ success: false, message: "Missing user information" });
  }

  // Kiểm tra nếu user đã trong danh sách
  const alreadyJoined = session.students.some((s) => s.id === userId);
  if (alreadyJoined) {
    return res.json({ success: true, data: session, message: "User already joined" });
  }

  // Thêm sinh viên thật
  const newStudent = {
    id: userId,
    name,
    status: "registered",
  };

  session.students.push(newStudent);
  console.log(` ${name} joined session ${session.title}`);

  res.json({ success: true, data: session });
};
// POST /api/sessions
exports.create = (req, res) => {
  const { title, date, time, type, location, description } = req.body;

  if (!title || !date || !time || !type || !location) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const newSession = {
    id: sessions.length + 1,
    title,
    date,
    time,
    type,
    location,
    description: description || '',
    objectives: [],
    materials: [],
    students: [],
  };

  sessions.unshift(newSession);
  res.status(201).json({ success: true, data: newSession });
};
