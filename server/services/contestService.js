const contestRepository = require('../repositories/contestRepository');

class ContestService {
  async getAll() {
    return await contestRepository.findAll();
  }

  async getOngoing() {
    return await contestRepository.findOpen();
  }

  async getById(id) {
    const contest = await contestRepository.findById(id);
    if (!contest) throw new Error('NOT_FOUND');
    return contest;
  }

  async register(contestId, userId) {
    const contest = await contestRepository.findById(contestId);
    if (!contest) throw new Error('NOT_FOUND');
    if (contest.status !== 'open') throw new Error('CONTEST_CLOSED');
    return await contestRepository.register(contestId, userId);
  }
}

module.exports = new ContestService();
