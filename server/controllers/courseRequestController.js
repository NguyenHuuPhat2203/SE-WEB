// controllers/courseRequestController.js
const tutors = [
  {
    id: 1,
    name: 'Demo Tutor 01',
    department: 'Computer Science',
    email: 'demotutor01@hcmut.edu.vn',
    listCourseCanTeach: ['demo0001', 'demo0002', 'test0001'],
  },
  {
    id: 2,
    name: 'Demo Tutor 02',
    department: 'Electrical Engineering',
    email: 'demotutor02@hcmut.edu.vn',
    listCourseCanTeach: ['demo0006', 'demo0007', 'test0001']
  },
  {
    id: 3,
    name: 'Demo Tutor 03',
    department: 'Mechanical Engineering',
    email: 'demotutor03@hcmut.edu.vn',
    listCourseCanTeach: ['demo0008', 'demo0009', 'demo0010', 'test0001']
  },
];


// let courses = [
//   { id: 1, code: 'CS101', name: 'Data Structures', department: 'Computer Science', numStudents: 45 },
//   { id: 2, code: 'CS102', name: 'Algorithms', department: 'Computer Science', numStudents: 52 },
//   { id: 3, code: 'CS201', name: 'Database Systems', department: 'Computer Science', numStudents: 38 },
//   { id: 4, code: 'CS301', name: 'Machine Learning', department: 'Computer Science', numStudents: 41 },
// ];

let courses = [
  {
    id: 1,
    code: 'demo0001',
    name: 'Introduction to Programming',
    department: 'Computer Science',
    numStudents: 48,
  },
  {
    id: 2,
    code: 'demo0002',
    name: 'Data Structures',
    department: 'Computer Science',
    numStudents: 53,
  },
  {
    id: 3,
    code: 'demo0003',
    name: 'Algorithms and Complexity',
    department: 'Computer Science',
    numStudents: 44,
  },
  {
    id: 4,
    code: 'demo0004',
    name: 'Database Systems',
    department: 'Information Systems',
    numStudents: 39,
  },
  {
    id: 5,
    code: 'demo0005',
    name: 'Business Intelligence',
    department: 'Information Systems',
    numStudents: 35,
  },
  {
    id: 6,
    code: 'demo0006',
    name: 'Circuit Design Fundamentals',
    department: 'Electrical Engineering',
    numStudents: 40,
  },
  {
    id: 7,
    code: 'demo0007',
    name: 'Microcontrollers and Embedded Systems',
    department: 'Electrical Engineering',
    numStudents: 37,
  },
  {
    id: 8,
    code: 'demo0008',
    name: 'Thermodynamics',
    department: 'Mechanical Engineering',
    numStudents: 45,
  },
  {
    id: 9,
    code: 'demo0009',
    name: 'Machine Design',
    department: 'Mechanical Engineering',
    numStudents: 51,
  },
  {
    id: 10,
    code: 'demo0010',
    name: 'Structural Analysis',
    department: 'Civil Engineering',
    numStudents: 33,
  },
  {
    id: 11,
    code: 'demo0011',
    name: 'Reinforced Concrete Design',
    department: 'Civil Engineering',
    numStudents: 29,
  },
];

let courseRequests = [
  {
    id: 1,
    studentName: 'Nguyen Huu Phat',
    studentId: '2312588',
    courseCode: 'demo0013',
    courseName: 'Machine Learning',
    requestDate: '2025-11-20',
    status: 'pending',
    // reason: 'Interested in AI and want to build a strong foundation in ML',
  },
  {
    id: 2,
    studentName: 'Doan Manh Tat',
    studentId: '2313074',
    courseCode: 'demo0014',
    courseName: 'Advanced Database Systems',
    requestDate: '2024-11-22',
    status: 'pending',
    // reason: 'Need this course for specialization in database management',
  },
  {
    id: 3,
    studentName: 'Nguyen Trong Nghia',
    studentId: '2312271',
    courseCode: 'demo0015',
    courseName: 'Computer Vision',
    requestDate: '2024-11-18',
    status: 'approved',
    // reason: 'Working on a research project related to image processing',
  },
];

//
// ============= COURSE API =============
//

exports.listCourses = (req, res) => {
  const withTutorCount = courses.map((course) => {
    const numTutors = tutors.filter(
      // (t) => t.department === course.department && t.listCourseCanTeach.includes(course.code)
      (t) => t.listCourseCanTeach.includes(course.code)
    ).length;

    return {
      ...course,
      numTutors,
      numStudents: course.numStudents || 0,
    };
  });

  res.json({ success: true, data: withTutorCount });
};

exports.addCourse = (req, res) => {
  const { code, name, department } = req.body;
  if (!code || !name || !department)
    return res.status(400).json({ success: false, message: 'Missing fields' });

  const newCourse = {
    id: Date.now(),
    code,
    name,
    department,
    numStudents: 0,
  };
  courses.unshift(newCourse);
  res.status(201).json({ success: true, data: newCourse });
};

exports.updateCourse = (req, res) => {
  const id = Number(req.params.id);
  const { code, name, department } = req.body;

  const course = courses.find((c) => c.id === id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

  course.code = code || course.code;
  course.name = name || course.name;
  course.department = department || course.department;

  res.json({ success: true, data: course });
};

exports.deleteCourse = (req, res) => {
  const id = Number(req.params.id);
  courses = courses.filter((c) => c.id !== id);
  res.json({ success: true, message: 'Deleted' });
};

//
// ============= COURSE REQUEST API =============
//

exports.listRequests = (req, res) => {
  res.json({ success: true, data: courseRequests });
};

exports.createRequest = (req, res) => {
  const { studentName, studentId, courseCode, courseName, department, reason } = req.body;

  if (!studentName || !studentId || !courseCode || !courseName) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // 🔍 Check if this student already has a non-rejected request for this course
  const duplicate = courseRequests.find(
    (r) =>
      r.studentId === studentId &&
      r.courseCode === courseCode &&
      r.status !== 'rejected' // <-- allow re-request if previously rejected
  );

  if (duplicate) {
    return res.status(400).json({ success: false, message: 'You already requested this course' });
  }

  const newRequest = {
    id: Date.now(),
    studentName,
    studentId,
    courseCode,
    courseName,
    department: department || 'Computer Science',
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    reason: reason || '',
  };

  courseRequests.unshift(newRequest);
  res.status(201).json({ success: true, data: newRequest });
};


exports.approveRequest = (req, res) => {
  const id = Number(req.params.id);
  const reqItem = courseRequests.find((r) => r.id === id);
  if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found' });

  reqItem.status = 'approved';

  const existingCourse = courses.find((c) => c.code === reqItem.courseCode);
  if (!existingCourse) {
    const newCourse = {
      id: Date.now(),
      code: reqItem.courseCode,
      name: reqItem.courseName,
      department: reqItem.department, // hoặc map từ request nếu có
      numStudents: 1,
    };
    courses.unshift(newCourse);
  } else {
    existingCourse.numStudents += 1;
  }

  res.json({ success: true, message: 'Approved and course updated', data: reqItem });
};

exports.rejectRequest = (req, res) => {
  const id = Number(req.params.id);
  const reqItem = courseRequests.find((r) => r.id === id);
  if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found' });
  reqItem.status = 'rejected';
  res.json({ success: true, message: 'Rejected', data: reqItem });
};
