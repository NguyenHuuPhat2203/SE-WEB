// repositories/contestRepositoryMongo.js
const { ContestModel } = require('../db/models');

class ContestRepositoryMongo {
  /**
   * Get all contests
   */
  async getAll(filters = {}) {
    try {
      const query = {};
      
      if (filters.type && filters.type !== 'all') {
        query.type = filters.type;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }

      return await ContestModel.find(query).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting contests:', error);
      throw error;
    }
  }

  /**
   * Get contest by ID
   */
  async getById(id) {
    try {
      return await ContestModel.findById(id);
    } catch (error) {
      console.error('Error getting contest by id:', error);
      throw error;
    }
  }

  /**
   * Create contest
   */
  async create(contestData) {
    try {
      const contest = new ContestModel(contestData);
      await contest.save();
      return contest;
    } catch (error) {
      console.error('Error creating contest:', error);
      throw error;
    }
  }

  /**
   * Register user for contest
   */
  async register(contestId, userId) {
    try {
      const contest = await ContestModel.findById(contestId);
      
      if (!contest) {
        throw new Error('NOT_FOUND');
      }

      if (contest.status === 'closed') {
        throw new Error('CONTEST_CLOSED');
      }

      if (contest.participants >= contest.maxParticipants) {
        throw new Error('CONTEST_FULL');
      }

      // Check if user already registered
      if (contest.registeredUsers.includes(userId)) {
        throw new Error('ALREADY_REGISTERED');
      }

      contest.participants += 1;
      contest.registeredUsers.push(userId);
      await contest.save();

      return contest;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update contest
   */
  async update(id, updates) {
    try {
      return await ContestModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating contest:', error);
      throw error;
    }
  }

  /**
   * Delete contest
   */
  async delete(id) {
    try {
      return await ContestModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting contest:', error);
      throw error;
    }
  }
}

module.exports = new ContestRepositoryMongo();
