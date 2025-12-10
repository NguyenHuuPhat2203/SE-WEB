const questionRepository = require("../repositories/questionRepositoryMongo");

class QAService {
  async list() {
    return await questionRepository.getAll();
  }

  async getById(id) {
    const q = await questionRepository.getById(id);
    if (!q) throw new Error("NOT_FOUND");
    return q;
  }

  async create({ title, content, topic, author }) {
    if (!title || !topic || !content) throw new Error("MISSING_FIELDS");
    return await questionRepository.create({ title, content, topic, author });
  }

  async addAnswer(questionId, answerData) {
    if (!answerData.content) throw new Error("MISSING_CONTENT");
    return await questionRepository.addAnswer(questionId, answerData);
  }
}

module.exports = new QAService();
