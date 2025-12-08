// repositories/tutorRepositoryMongo.js
const { TutorModel } = require('../db/models');

class TutorRepositoryMongo {
  /**
   * Get all tutors
   */
  async getAll(filters = {}) {
    try {
      const query = {};
      
      if (filters.department) {
        query.department = filters.department;
      }
      
      if (filters.specialization) {
        query.specialization = filters.specialization;
      }

      return await TutorModel.find(query).sort({ rating: -1 });
    } catch (error) {
      console.error('Error getting tutors:', error);
      throw error;
    }
  }

  /**
   * Get tutor by ID
   */
  async getById(id) {
    try {
      return await TutorModel.findById(id).populate('userId', '-password');
    } catch (error) {
      console.error('Error getting tutor by id:', error);
      throw error;
    }
  }

  /**
   * Get tutor by tutorId
   */
  async getByTutorId(tutorId) {
    try {
      return await TutorModel.findOne({ tutorId });
    } catch (error) {
      console.error('Error getting tutor by tutorId:', error);
      throw error;
    }
  }

  /**
   * Create tutor
   */
  async create(tutorData) {
    try {
      const tutor = new TutorModel(tutorData);
      await tutor.save();
      return tutor;
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  /**
   * Update tutor
   */
  async update(id, updates) {
    try {
      return await TutorModel.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating tutor:', error);
      throw error;
    }
  }

  /**
   * Delete tutor
   */
  async delete(id) {
    try {
      return await TutorModel.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting tutor:', error);
      throw error;
    }
  }

  /**
   * Get all departments
   */
  async getDepartments() {
    try {
      return await TutorModel.distinct('department');
    } catch (error) {
      console.error('Error getting departments:', error);
      throw error;
    }
  }

  /**
   * Get all specializations
   */
  async getSpecializations() {
    try {
      return await TutorModel.distinct('specialization');
    } catch (error) {
      console.error('Error getting specializations:', error);
      throw error;
    }
  }
}

module.exports = new TutorRepositoryMongo();
