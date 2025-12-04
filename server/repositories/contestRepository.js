// repositories/contestRepository.js
const Contest = require('../models/Contest');

class ContestRepository {
  async findAll() {
    try {
      return await Contest.find()
        .populate('organizer', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error finding all contests:', error);
      throw error;
    }
  }

  async findOpen() {
    try {
      return await Contest.find({ status: 'open' })
        .populate('organizer', 'firstName lastName bknetId')
        .sort({ 'period.start': 1 });
    } catch (error) {
      console.error('Error finding open contests:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Contest.findById(id)
        .populate('organizer', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error finding contest by id:', error);
      throw error;
    }
  }

  async create(contestData) {
    try {
      const contest = new Contest(contestData);
      await contest.save();
      return contest;
    } catch (error) {
      console.error('Error creating contest:', error);
      throw error;
    }
  }

  async register(contestId, userId) {
    try {
      const contest = await Contest.findById(contestId);
      if (!contest) return null;
      if (contest.status !== 'open') return contest;
      
      // Check if user already registered
      if (contest.participants.includes(userId)) {
        return contest;
      }
      
      // Check if max participants reached
      if (contest.maxParticipants && contest.participants.length >= contest.maxParticipants) {
        throw new Error('Contest is full');
      }
      
      contest.participants.push(userId);
      await contest.save();
      return await this.findById(contestId);
    } catch (error) {
      console.error('Error registering for contest:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Contest.findByIdAndUpdate(id, updateData, { new: true })
        .populate('organizer', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error updating contest:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Contest.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting contest:', error);
      throw error;
    }
  }
}

module.exports = new ContestRepository();