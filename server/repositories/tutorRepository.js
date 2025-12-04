// repositories/tutorRepository.js
const Tutor = require('../models/Tutor');

class TutorRepository {
  async findAll() {
    try {
      return await Tutor.find({ status: 'active' })
        .populate('user', 'firstName lastName bknetId avatar')
        .sort({ 'rating.average': -1 });
    } catch (error) {
      console.error('Error finding all tutors:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Tutor.findById(id)
        .populate('user', 'firstName lastName bknetId email avatar')
        .populate('reviews.user', 'firstName lastName bknetId');
    } catch (error) {
      console.error('Error finding tutor by id:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      return await Tutor.findOne({ user: userId })
        .populate('user', 'firstName lastName bknetId email avatar');
    } catch (error) {
      console.error('Error finding tutor by user id:', error);
      throw error;
    }
  }

  async findSuggestions(userId) {
    try {
      // For now, return top-rated tutors
      // TODO: Implement AI-based matching algorithm
      return await Tutor.find({ status: 'active' })
        .populate('user', 'firstName lastName bknetId avatar')
        .sort({ 'rating.average': -1 })
        .limit(10);
    } catch (error) {
      console.error('Error finding tutor suggestions:', error);
      throw error;
    }
  }

  async getDepartments() {
    try {
      const departments = await Tutor.distinct('department');
      return departments.sort();
    } catch (error) {
      console.error('Error getting departments:', error);
      throw error;
    }
  }

  async getSpecializations() {
    try {
      const tutors = await Tutor.find();
      const specializations = new Set();
      tutors.forEach(tutor => {
        tutor.specialization.forEach(spec => specializations.add(spec));
      });
      return Array.from(specializations).sort();
    } catch (error) {
      console.error('Error getting specializations:', error);
      throw error;
    }
  }

  async create(tutorData) {
    try {
      const tutor = new Tutor(tutorData);
      await tutor.save();
      return await this.findById(tutor._id);
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw error;
    }
  }

  async addReview(tutorId, userId, rating, comment) {
    try {
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) return null;
      
      tutor.reviews.push({
        user: userId,
        rating,
        comment
      });
      
      // Update average rating
      const totalRating = tutor.reviews.reduce((sum, r) => sum + r.rating, 0);
      tutor.rating = {
        average: totalRating / tutor.reviews.length,
        count: tutor.reviews.length
      };
      
      await tutor.save();
      return await this.findById(tutorId);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await Tutor.findByIdAndUpdate(id, updateData, { new: true })
        .populate('user', 'firstName lastName bknetId email avatar');
    } catch (error) {
      console.error('Error updating tutor:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await Tutor.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting tutor:', error);
      throw error;
    }
  }
}

module.exports = new TutorRepository();
