const Contest = require('../models/Contest');

class ContestRepository {
  constructor() {
    this.contests = [
      new Contest({
        id: 1,
        title: 'Algorithm Challenge 2025',
        type: 'academic',
        description: 'Competitive programming contest',
        period: 'Dec 20 - Dec 25',
        status: 'open',
        participants: 45,
      }),
      new Contest({
        id: 2,
        title: 'Hackathon: Smart City Solutions',
        type: 'non-academic',
        description: 'Build innovative solutions for smart cities',
        period: 'Jan 10 - Jan 15',
        status: 'open',
        participants: 32,
      }),
      new Contest({
        id: 3,
        title: 'Data Science Competition',
        type: 'academic',
        description: 'Machine learning and data analysis',
        period: 'Nov 15 - Nov 30',
        status: 'closed',
        participants: 67,
      }),
    ];
  }

  findAll() {
    return this.contests;
  }

  findOpen() {
    return this.contests.filter((c) => c.status === 'open');
  }

  findById(id) {
    return this.contests.find((c) => c.id === Number(id)) || null;
  }

  register(id) {
    const contest = this.findById(id);
    if (!contest) return null;
    if (contest.status !== 'open') return contest;
    contest.participants += 1;
    return contest;
  }
}

module.exports = new ContestRepository();