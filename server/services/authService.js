// services/authService.js
const userRepository = require("../repositories/userRepositoryMongo");
const {
  validateRegistration,
  validateBknetId,
  sanitizeString,
} = require("../utils/validation");
const { generateToken } = require("../utils/jwt");

class AuthService {
  async register({ firstName, lastName, bknetId, password, role }) {
    // Validate input
    const validation = validateRegistration({
      firstName,
      lastName,
      bknetId,
      password,
      role,
    });
    if (!validation.valid) {
      const error = new Error("VALIDATION_ERROR");
      error.errors = validation.errors;
      throw error;
    }

    // Check if user exists
    const existing = await userRepository.findByBknetId(bknetId);
    if (existing) {
      throw new Error("USER_EXISTS");
    }

    // Create user (password will be hashed in UserModel pre-save hook)
    const newUser = await userRepository.create({
      firstName: sanitizeString(firstName),
      lastName: sanitizeString(lastName),
      bknetId: sanitizeString(bknetId).toLowerCase(),
      password: password, // Will be hashed by mongoose middleware
      role: role || "student",
    });

    // Generate JWT token
    const token = generateToken(newUser);

    return { user: newUser, token };
  }

  async login({ bknetId, password }) {
    if (!bknetId || !password) {
      throw new Error("MISSING_FIELDS");
    }

    console.log("[LOGIN] Attempting login for:", bknetId);

    // Find user with password field
    const { UserModel } = require("../db/models");
    const user = await UserModel.findOne({
      bknetId: bknetId.toLowerCase(),
    }).select("+password");

    console.log("[LOGIN] User found:", !!user);
    if (!user) {
      console.log("[LOGIN] User not found in database");
      throw new Error("INVALID_CREDENTIALS");
    }

    console.log("[LOGIN] Testing password comparison...");
    // Verify password using model method
    const isValid = await user.comparePassword(password);
    console.log("[LOGIN] Password valid:", isValid);

    if (!isValid) {
      console.log("[LOGIN] Password comparison failed");
      throw new Error("INVALID_CREDENTIALS");
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async findAccount({ bknetId }) {
    if (!bknetId) throw new Error("MISSING_FIELDS");
    const user = await userRepository.findByBknetId(bknetId);
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
  }

  async resetPassword({ bknetId, captcha, newPassword }) {
    if (!bknetId || !captcha || !newPassword) {
      throw new Error("MISSING_FIELDS");
    }

    // demo: captcha cố định CAPTCHA
    if (captcha !== "CAPTCHA") {
      throw new Error("INVALID_CAPTCHA");
    }

    const user = await userRepository.updatePassword(bknetId, newPassword);
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
  }
}

module.exports = new AuthService();
