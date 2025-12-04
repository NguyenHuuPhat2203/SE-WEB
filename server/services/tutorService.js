const tutorRepository = require('../repositories/tutorRepository');

class TutorService {
  async list() {
    return await tutorRepository.findAll();
  }

  async getById(id) {
    const t = await tutorRepository.findById(id);
    if (!t) throw new Error('NOT_FOUND');
    return t;
  }

  async suggestions(userId) {
    return await tutorRepository.findSuggestions(userId);
  }

  async departments() {
    return await tutorRepository.getDepartments();
  }

  async specializations() {
    return await tutorRepository.getSpecializations();
  }
}

module.exports = new TutorService();
