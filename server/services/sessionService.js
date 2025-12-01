const sessionRepository = require('../repositories/sessionRepository');

class SessionService {
  list(type) {
    if (type === 'my') return sessionRepository.findMySessions();
    if (type === 'upcoming') return sessionRepository.findUpcoming();
    if (type === 'ongoing') return sessionRepository.findOngoing();
    return sessionRepository.findAll();
  }

  getById(id) {
    const s = sessionRepository.findById(id);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }

  join(id) {
    const s = sessionRepository.join(id);
    if (!s) throw new Error('NOT_FOUND');
    return s;
  }
}

module.exports = new SessionService();
