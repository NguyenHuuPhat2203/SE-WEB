// utils/password.js
const crypto = require('crypto');

/**
 * Hash password using PBKDF2
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password with salt
 */
function hashPassword(password) {
  // Generate random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash password with salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  
  // Return salt:hash format
  return `${salt}:${hash}`;
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} storedHash - Stored hash in salt:hash format
 * @returns {boolean} - True if password matches
 */
function verifyPassword(password, storedHash) {
  try {
    // Split salt and hash
    const [salt, originalHash] = storedHash.split(':');
    
    if (!salt || !originalHash) {
      return false;
    }
    
    // Hash provided password with same salt
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    
    // Compare hashes
    return hash === originalHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
};
