const questionRepository = require('../repositories/questionRepository');

class QAService {
  list() {
    return questionRepository.findAll();
  }

  getById(id) {
    const q = questionRepository.findById(id);
    if (!q) throw new Error('NOT_FOUND');
    return q;
  }

  create({ title, content, topic, author }) {
    if (!title || !topic || !content) throw new Error('MISSING_FIELDS');
    return questionRepository.create({ title, content, topic, author });
  }
}

module.exports = new QAService();
