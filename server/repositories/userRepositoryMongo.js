// repositories/userRepositoryMongo.js - MongoDB version
const { UserModel } = require("../db/models");

class UserRepositoryMongo {
  /**
   * Find user by BKNet ID
   */
  async findByBknetId(bknetId) {
    try {
      return await UserModel.findOne({ bknetId: bknetId.toLowerCase() }).select(
        "+password"
      );
    } catch (error) {
      console.error("Error finding user by bknetId:", error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw error;
    }
  }

  /**
   * Get all users (without passwords)
   */
  async getAll() {
    try {
      return await UserModel.find().select("-password");
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async create(userData) {
    try {
      const user = new UserModel(userData);
      await user.save();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(bknetId, updates) {
    try {
      const user = await UserModel.findOneAndUpdate(
        { bknetId: bknetId.toLowerCase() },
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      return user;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(bknetId, newPassword) {
    try {
      const user = await UserModel.findOne({ bknetId: bknetId.toLowerCase() });
      if (!user) return null;

      user.password = newPassword;
      await user.save(); // Will trigger pre-save hook to hash password

      return user;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  /**
   * Add notification to user
   */
  async addNotification(bknetId, notificationData) {
    try {
      const user = await UserModel.findOne({ bknetId: bknetId.toLowerCase() });
      if (!user) return null;

      user.addNotification(notificationData);
      await user.save();

      return user.notifications[0];
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(bknetId, notificationId) {
    try {
      const user = await UserModel.findOne({ bknetId: bknetId.toLowerCase() });
      if (!user) return null;

      user.markNotificationRead(notificationId);
      await user.save();

      return user;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(bknetId) {
    try {
      const user = await UserModel.findOne({
        bknetId: bknetId.toLowerCase(),
      }).select("notifications");

      return user ? user.notifications : [];
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async delete(bknetId) {
    try {
      return await UserModel.findOneAndDelete({
        bknetId: bknetId.toLowerCase(),
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

module.exports = new UserRepositoryMongo();
