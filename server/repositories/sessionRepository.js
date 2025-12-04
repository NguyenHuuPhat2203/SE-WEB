// repositories/sessionRepository.js
const Session = require('../models/Session');

class SessionRepository {
  async findAll() {
    try {
      return await Session.find()
        .populate('tutor', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Error finding all sessions:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Session.findById(id)
        .populate('tutor', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId')
        .populate('feedbacks.user', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error finding session by id:', error);
      throw error;
    }
  }

  async findMySessions(userId) {
    try {
      return await Session.find({ participants: userId })
        .populate('tutor', 'firstName lastName bknetId')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Error finding my sessions:', error);
      throw error;
    }
  }

  async findUpcoming() {
    try {
      const now = new Date();
      return await Session.find({ 
        status: 'upcoming',
        date: { $gte: now }
      })
        .populate('tutor', 'firstName lastName bknetId')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Error finding upcoming sessions:', error);
      throw error;
    }
  }

  async findOngoing() {
    try {
      return await Session.find({ status: 'ongoing' })
        .populate('tutor', 'firstName lastName bknetId')
        .sort({ date: 1 });
    } catch (error) {
      console.error('Error finding ongoing sessions:', error);
      throw error;
    }
  }

  async findByTutor(tutorId) {
    try {
      return await Session.find({ tutor: tutorId })
        .populate('participants', 'firstName lastName bknetId')
        .sort({ date: -1 });
    } catch (error) {
      console.error('Error finding sessions by tutor:', error);
      throw error;
    }
  }

  async create(sessionData) {
    try {
      const session = new Session(sessionData);
      await session.save();
      return await this.findById(session._id);
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async join(sessionId, userId) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) return null;
      
      // Check if user already joined
      if (session.participants.includes(userId)) {
        return await this.findById(sessionId);
      }
      
      // Check if session is full
      if (session.participants.length >= session.maxParticipants) {
        throw new Error('Session is full');
      }
      
      session.participants.push(userId);
      await session.save();
      return await this.findById(sessionId);
    } catch (error) {
      console.error('Error joining session:', error);
      throw error;
    }
  }

  async addFeedback(sessionId, userId, rating, comment) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) return null;
      
      session.feedbacks.push({
        user: userId,
        rating,
        comment
      });
      
      // Update average rating
      const totalRating = session.feedbacks.reduce((sum, f) => sum + f.rating, 0);
      session.rating = {
        average: totalRating / session.feedbacks.length,
        count: session.feedbacks.length
      };
      
      await session.save();
      return await this.findById(sessionId);
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Session.findByIdAndUpdate(id, updateData, { new: true })
        .populate('tutor', 'firstName lastName bknetId')
        .populate('participants', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Session.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

module.exports = new SessionRepository();
