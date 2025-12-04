// repositories/userRepository.js
const User = require('../models/User');

class UserRepository {
  async findByBknetId(bknetId) {
    try {
      return await User.findOne({ bknetId });
    } catch (error) {
      console.error('Error finding user by bknetId:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getAll() {
    try {
      return await User.find().select('-password');
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async updatePassword(bknetId, newPassword) {
    try {
      const user = await User.findOne({ bknetId });
      if (!user) return null;
      
      user.password = newPassword;
      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  async findByRole(role) {
    try {
      return await User.find({ role }).select('-password');
    } catch (error) {
      console.error('Error finding users by role:', error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
