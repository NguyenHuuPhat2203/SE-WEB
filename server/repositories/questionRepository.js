// repositories/questionRepository.js
const Question = require('../models/Question');

class QuestionRepository {
  async findAll(filters = {}) {
    try {
      const query = {};
      
      if (filters.topic) {
        query.topic = filters.topic;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      
      return await Question.find(query)
        .populate('author', 'firstName lastName bknetId')
        .populate('answers.author', 'firstName lastName bknetId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error finding all questions:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const question = await Question.findById(id)
        .populate('author', 'firstName lastName bknetId')
        .populate('answers.author', 'firstName lastName bknetId')
        .populate('answers.upvotedBy', 'firstName lastName bknetId');
      
      // Increment views
      if (question) {
        question.views += 1;
        await question.save();
      }
      
      return question;
    } catch (error) {
      console.error('Error finding question by id:', error);
      throw error;
    }
  }

  async create(questionData) {
    try {
      const question = new Question(questionData);
      await question.save();
      return await this.findById(question._id);
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async addAnswer(questionId, answerData) {
    try {
      const question = await Question.findById(questionId);
      if (!question) return null;
      
      question.answers.push(answerData);
      
      // Update status if this is the first answer
      if (question.status === 'unanswered') {
        question.status = 'answered';
      }
      
      await question.save();
      return await this.findById(questionId);
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  async acceptAnswer(questionId, answerId) {
    try {
      const question = await Question.findById(questionId);
      if (!question) return null;
      
      // Remove acceptance from all answers
      question.answers.forEach(answer => {
        answer.isAccepted = false;
      });
      
      // Accept the specified answer
      const answer = question.answers.id(answerId);
      if (answer) {
        answer.isAccepted = true;
      }
      
      await question.save();
      return await this.findById(questionId);
    } catch (error) {
      console.error('Error accepting answer:', error);
      throw error;
    }
  }

  async upvoteQuestion(questionId, userId) {
    try {
      const question = await Question.findById(questionId);
      if (!question) return null;
      
      const index = question.upvotedBy.indexOf(userId);
      if (index > -1) {
        // Remove upvote
        question.upvotedBy.splice(index, 1);
        question.upvotes -= 1;
      } else {
        // Add upvote
        question.upvotedBy.push(userId);
        question.upvotes += 1;
      }
      
      await question.save();
      return await this.findById(questionId);
    } catch (error) {
      console.error('Error upvoting question:', error);
      throw error;
    }
  }

  async upvoteAnswer(questionId, answerId, userId) {
    try {
      const question = await Question.findById(questionId);
      if (!question) return null;
      
      const answer = question.answers.id(answerId);
      if (!answer) return null;
      
      const index = answer.upvotedBy.indexOf(userId);
      if (index > -1) {
        // Remove upvote
        answer.upvotedBy.splice(index, 1);
        answer.upvotes -= 1;
      } else {
        // Add upvote
        answer.upvotedBy.push(userId);
        answer.upvotes += 1;
      }
      
      await question.save();
      return await this.findById(questionId);
    } catch (error) {
      console.error('Error upvoting answer:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Question.findByIdAndUpdate(id, updateData, { new: true })
        .populate('author', 'firstName lastName bknetId')
        .populate('answers.author', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Question.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }
}

module.exports = new QuestionRepository();
