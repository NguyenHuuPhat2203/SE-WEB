const Tutor = require('../models/Tutor');

class TutorRepository {
  constructor() {
    this.tutors = [
      new Tutor({
        id: 1,
        name: 'Dr. Tran Thi B',
        department: 'Computer Science',
        specialization: ['Data Structures', 'Algorithms', 'Programming'],
        rating: 4.8,
        reviews: 24,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        nextAvailable: 'Tomorrow, 2:00 PM',
        matchScore: 95,
      }),
      new Tutor({
        id: 2,
        name: 'Dr. Nguyen Van C',
        department: 'Computer Science',
        specialization: ['Database', 'Web Development', 'Software Engineering'],
        rating: 4.6,
        reviews: 18,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        nextAvailable: 'Today, 4:00 PM',
        matchScore: 87,
      }),
      new Tutor({
        id: 3,
        name: 'Dr. Le Thi D',
        department: 'Computer Science',
        specialization: ['Machine Learning', 'AI', 'Data Science'],
        rating: 4.9,
        reviews: 32,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        nextAvailable: 'Next week, Mon 10:00 AM',
        matchScore: 92,
      }),
    ];
  }

  findAll() {
    return this.tutors;
  }

  findById(id) {
    return this.tutors.find((t) => t.id === Number(id)) || null;
  }

  findSuggestions(/*bknetId*/) {
    // demo: sort by matchScore
    return [...this.tutors].sort((a, b) => b.matchScore - a.matchScore);
  }

  getDepartments() {
    return [...new Set(this.tutors.map((t) => t.department))];
  }

  getSpecializations() {
    return [...new Set(this.tutors.flatMap((t) => t.specialization))];
  }
}

module.exports = new TutorRepository();
