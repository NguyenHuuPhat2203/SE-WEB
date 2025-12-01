const Session = require('../models/Session');

class SessionRepository {
  constructor() {
    this.sessions = [
      // My sessions (id 1,2) khớp với ConsultationSessionsScreen
      new Session({
        id: 1,
        title: 'Assembly programming guide',
        subject: 'Computer Architecture',
        tutor: 'Lê Thanh Vân',
        date: 'Tomorrow, 3:00 PM',
        participants: 12,
        maxParticipants: 20,
        status: 'upcoming',
        description: 'Learn the fundamentals of assembly programming',
      }),
      new Session({
        id: 2,
        title: 'Sorting algorithms',
        subject: 'DSA',
        tutor: 'Lê Thanh Sách',
        date: 'Now',
        participants: 18,
        maxParticipants: 25,
        status: 'ongoing',
        description: 'Deep dive into sorting algorithms and their complexities',
      }),
      // Upcoming sessions (3,4,5)
      new Session({
        id: 3,
        title: 'How to build a semantic checker',
        subject: 'PPL',
        tutor: 'Nguyễn Hữa Phùng',
        date: 'Friday, 2:00 PM',
        participants: 8,
        maxParticipants: 15,
        status: 'upcoming',
        description: 'Build a semantic checker for a programming language',
        rating: 4.9,
      }),
      new Session({
        id: 4,
        title: 'Operating Systems Concepts',
        subject: 'Operating Systems',
        tutor: 'Trần Minh Khoa',
        date: 'Saturday, 10:00 AM',
        participants: 15,
        maxParticipants: 30,
        status: 'upcoming',
        description: 'Understanding process management and scheduling',
        rating: 4.7,
      }),
      new Session({
        id: 5,
        title: 'Database Design Best Practices',
        subject: 'Database Systems',
        tutor: 'Ngô Thị Hương',
        date: 'Monday, 4:00 PM',
        participants: 10,
        maxParticipants: 20,
        status: 'upcoming',
        description: 'Learn normalization and database optimization techniques',
        rating: 4.8,
      }),
    ];

    // demo: mySessions là [1,2] cho user hiện tại
    this.mySessionIds = new Set([1, 2]);
  }

  findAll() {
    return this.sessions;
  }

  findById(id) {
    return this.sessions.find((s) => s.id === Number(id)) || null;
  }

  findMySessions() {
    return this.sessions.filter((s) => this.mySessionIds.has(s.id));
  }

  findUpcoming() {
    return this.sessions.filter((s) => !this.mySessionIds.has(s.id));
  }

  findOngoing() {
    return this.sessions.filter((s) => s.status === 'ongoing');
  }

  join(id) {
    const session = this.findById(id);
    if (!session) return null;
    if (session.participants >= session.maxParticipants) {
      throw new Error('FULL');
    }
    this.mySessionIds.add(session.id);
    session.participants += 1;
    return session;
  }
}

module.exports = new SessionRepository();
