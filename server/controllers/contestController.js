// --- Hard-coded minimal contest data ---
let contests = [
  {
    id: 1,
    title: 'Algorithm Challenge 2025',
    type: 'academic',
    description: 'Competitive programming contest for HCMUT students.',
    status: 'open',
    participants: 45,
    maxParticipants: 100,
    location: 'Online',
    organizer: 'Computer Science Dept.',
    startDate: 'Nov 25, 2025 - 9:00 AM',
    endDate: 'Dec 25, 2025 - 5:00 PM',
    rules: ['Individual participation only.'],
  },
  {
    id: 2,
    title: 'Hackathon: Smart City Solutions',
    type: 'non-academic',
    description: 'Build innovative solutions for smart cities.',
    status: 'closed',
    participants: 32,
    maxParticipants: 80,
    location: 'HCMUT Innovation Hub',
    organizer: 'Innovation Lab',
    startDate: 'Jan 10, 2025 - 8:00 AM',
    endDate: 'Jan 15, 2025 - 6:00 PM',
    rules: ['Teams of 3-5 members.'],
  },
  {
    id: 3,
    title: 'Data Science Competition',
    type: 'academic',
    description: 'Machine learning and data analysis challenge.',
    status: 'open',
    participants: 67,
    maxParticipants: 100,
    location: 'Online',
    organizer: 'AI Lab',
    startDate: 'Nov 30, 2025 - 10:00 AM',
    endDate: 'Dec 25, 2025 - 11:59 PM',
    rules: ['Individual or team max 3 members.'],
  },
];

// --- Controller methods ---

// GET /api/contests
exports.list = (req, res) => {
  const { type } = req.query;
  let filtered = contests;
  if (type && type !== 'all') {
    filtered = contests.filter((c) => c.type === type);
  }
  res.json({ success: true, data: filtered });
};

// GET /api/contests/:id
exports.detail = (req, res) => {
  const id = Number(req.params.id);
  const contest = contests.find((c) => c.id === id);
  if (!contest) {
    return res.status(404).json({ success: false, message: 'Contest not found' });
  }
  res.json({ success: true, data: contest });
};

// POST /api/contests/:id/register
exports.register = (req, res) => {
  const id = Number(req.params.id);
  const contest = contests.find((c) => c.id === id);

  if (!contest) {
    return res.status(404).json({ success: false, message: 'Contest not found' });
  }

  if (contest.status === 'closed') {
    return res.status(400).json({ success: false, message: 'Contest is closed' });
  }

  if (contest.participants >= contest.maxParticipants) {
    return res.status(400).json({ success: false, message: 'Contest is full' });
  }

  contest.participants += 1;

  res.json({
    success: true,
    message: 'Registered successfully!',
    data: contest,
  });
};

// // POST /api/contests
// exports.create = (req, res) => {
//   const { title, type, description, startDate, endDate, location, organizer } = req.body;

//   if (!title || !type || !startDate || !endDate) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   const newContest = {
//     id: contests.length + 1,
//     title,
//     type,
//     description: description || '',
//     status: 'open',
//     participants: 0,
//     maxParticipants: 100,
//     location: location || 'Online',
//     organizer: organizer || 'Tutor',
//     startDate,
//     endDate,
//     rules: [],
//   };

//   // Thêm lên đầu danh sách
//   contests.unshift(newContest);
//   res.status(201).json({ success: true, data: newContest });
// };


exports.create = (req, res) => {
  const {
    title,
    type,
    description,
    startDate,
    endDate,
    location,
    organizer,
    rules
  } = req.body;

  if (!title || !type || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields',
    });
  }

  const newContest = {
    id: contests.length + 1,
    title,
    type,
    description: description || '',
    status: 'open',
    participants: 0,
    maxParticipants: 100,
    location: location || 'Online',
    organizer: organizer || 'Tutor Department',
    startDate,
    endDate,
    rules: rules && Array.isArray(rules) ? rules : [],
  };

  contests.unshift(newContest);
  res.status(201).json({ success: true, data: newContest });
};
