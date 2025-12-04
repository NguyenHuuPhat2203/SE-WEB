const questionRepository = require('../repositories/questionRepository');

class QAService {
  async list(filters = {}) {
    return await questionRepository.findAll(filters);
  }

  async getById(id) {
    const q = await questionRepository.findById(id);
    if (!q) throw new Error('NOT_FOUND');
    return q;
  }

  async create({ title, content, topic, author, tags }) {
    if (!title || !topic || !content || !author) throw new Error('MISSING_FIELDS');
    return await questionRepository.create({ title, content, topic, author, tags });
  }

  async addAnswer(questionId, answerData) {
    const q = await questionRepository.findById(questionId);
    if (!q) throw new Error('NOT_FOUND');
    return await questionRepository.addAnswer(questionId, answerData);
  }
}

module.exports = new QAService();
