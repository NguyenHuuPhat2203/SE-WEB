const contestRepository = require('../repositories/contestRepository');

class ContestService {
  getAll() {
    return contestRepository.findAll();
  }

  getOngoing() {
    return contestRepository.findOpen();
  }

  getById(id) {
    const contest = contestRepository.findById(id);
    if (!contest) throw new Error('NOT_FOUND');
    return contest;
  }

  register(contestId) {
    const contest = contestRepository.register(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    if (contest.status !== 'open') throw new Error('CONTEST_CLOSED');
    return contest;
  }
}

module.exports = new ContestService();
