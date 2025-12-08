// utils/jwt.js - JWT token utilities
const jwt = require('jsonwebtoken');
const config = require('./config');

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id, bknetId, role
 * @returns {string} - JWT token
 */
function generateToken(user) {
  const payload = {
    id: user._id || user.id,
    bknetId: user.bknetId,
    role: user.role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Decode JWT token without verifying
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
function decodeToken(token) {
  return jwt.decode(token);
}

/**
 * Generate refresh token (longer expiration)
 * @param {Object} user - User object
 * @returns {string} - Refresh token
 */
function generateRefreshToken(user) {
  const payload = {
    id: user._id || user.id,
    bknetId: user.bknetId,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '30d', // Refresh tokens last longer
  });
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
};
