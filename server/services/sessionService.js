const sessionRepository = require('../repositories/sessionRepository');

class SessionService {
  async list(type, userId) {
    if (type === 'my' && userId) return await sessionRepository.findMySessions(userId);
    if (type === 'upcoming') return await sessionRepository.findUpcoming();
    if (type === 'ongoing') return await sessionRepository.findOngoing();
    return await sessionRepository.findAll();
  }

  async getById(id) {
    const s = await sessionRepository.findById(id);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }

  async join(sessionId, userId) {
    const s = await sessionRepository.join(sessionId, userId);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }
}

module.exports = new SessionService();
