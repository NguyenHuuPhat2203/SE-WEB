// repositories/questionRepositoryMongo.js
const { QuestionModel } = require('../db/models');

class QuestionRepositoryMongo {
  /**
   * Get all questions
   */
  async getAll(filters = {}) {
    try {
      const query = {};
      
      if (filters.topic) {
        query.topic = filters.topic;
      }
      
      if (filters.tag) {
        query.tags = filters.tag;
      }

      return await QuestionModel.find(query).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  }

  /**
   * Get question by ID
   */
  async getById(id) {
    try {
      const question = await QuestionModel.findById(id);
      
      // Increment views
      if (question) {
        question.views += 1;
        await question.save();
      }
      
      return question;
    } catch (error) {
      console.error('Error getting question by id:', error);
      throw error;
    }
  }

  /**
   * Create question
   */
  async create(questionData) {
    try {
      const question = new QuestionModel(questionData);
      await question.save();
      return question;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  /**
   * Add answer to question
   */
  async addAnswer(questionId, answerData) {
    try {
      const question = await QuestionModel.findById(questionId);
      
      if (!question) {
        throw new Error('NOT_FOUND');
      }

      question.answers.push(answerData);
      await question.save();

      return question;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update question
   */
  async update(id, updates) {
    try {
      return await QuestionModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  /**
   * Delete question
   */
  async delete(id) {
    try {
      return await QuestionModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  /**
   * Like question
   */
  async likeQuestion(id) {
    try {
      return await QuestionModel.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
    } catch (error) {
      console.error('Error liking question:', error);
      throw error;
    }
  }

  /**
   * Like answer
   */
  async likeAnswer(questionId, answerId) {
    try {
      const question = await QuestionModel.findById(questionId);
      if (!question) throw new Error('NOT_FOUND');

      const answer = question.answers.id(answerId);
      if (!answer) throw new Error('ANSWER_NOT_FOUND');

      answer.likes += 1;
      await question.save();

      return question;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new QuestionRepositoryMongo();
