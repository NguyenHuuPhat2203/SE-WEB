const tutorRepository = require('../repositories/tutorRepository');

class TutorService {
  list() {
    return tutorRepository.findAll();
  }

  getById(id) {
    const t = tutorRepository.findById(id);
    if (!t) throw new Error('NOT_FOUND');
    return t;
  }

  suggestions(/*bknetId*/) {
    return tutorRepository.findSuggestions();
  }

  departments() {
    return tutorRepository.getDepartments();
  }

  specializations() {
    return tutorRepository.getSpecializations();
  }
}

module.exports = new TutorService();
