// repositories/sessionRepositoryMongo.js
const { SessionModel } = require('../db/models');

class SessionRepositoryMongo {
  /**
   * Get all sessions
   */
  async getAll(filters = {}) {
    try {
      const query = {};
      
      if (filters.type) {
        query.type = filters.type;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }

      return await SessionModel.find(query).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  }

  /**
   * Get session by ID
   */
  async getById(id) {
    try {
      return await SessionModel.findById(id);
    } catch (error) {
      console.error('Error getting session by id:', error);
      throw error;
    }
  }

  /**
   * Create session
   */
  async create(sessionData) {
    try {
      const session = new SessionModel(sessionData);
      await session.save();
      return session;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Join session
   */
  async join(sessionId, studentData) {
    try {
      const session = await SessionModel.findById(sessionId);
      
      if (!session) {
        throw new Error('NOT_FOUND');
      }

      if (session.currentStudents >= session.capacity) {
        throw new Error('SESSION_FULL');
      }

      // Check if student already joined
      const alreadyJoined = session.students.some(
        s => s.id === studentData.id || s.userId?.toString() === studentData.userId
      );

      if (alreadyJoined) {
        throw new Error('ALREADY_JOINED');
      }

      session.students.push(studentData);
      session.currentStudents += 1;
      await session.save();

      return session;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update session
   */
  async update(id, updates) {
    try {
      return await SessionModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  /**
   * Delete session
   */
  async delete(id) {
    try {
      return await SessionModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }
}

module.exports = new SessionRepositoryMongo();
