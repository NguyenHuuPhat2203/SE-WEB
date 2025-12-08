// utils/validation.js

/**
 * Validate BKNet ID format (basic check)
 */
function validateBknetId(bknetId) {
  if (!bknetId || typeof bknetId !== 'string') {
    return { valid: false, message: 'BKNet ID is required' };
  }
  
  if (bknetId.length < 3 || bknetId.length > 50) {
    return { valid: false, message: 'BKNet ID must be 3-50 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate password strength
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: 'Password too long (max 128 characters)' };
  }
  
  return { valid: true };
}

/**
 * Validate name fields
 */
function validateName(name, fieldName = 'Name') {
  if (!name || typeof name !== 'string') {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, message: `${fieldName} must be 1-100 characters` };
  }
  
  return { valid: true };
}

/**
 * Validate role
 */
function validateRole(role) {
  const validRoles = ['student', 'tutor', 'cod', 'ctsv'];
  
  if (!role || !validRoles.includes(role)) {
    return { 
      valid: false, 
      message: `Role must be one of: ${validRoles.join(', ')}` 
    };
  }
  
  return { valid: true };
}

/**
 * Sanitize string input (basic XSS prevention)
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent basic XSS
    .slice(0, 1000); // Limit length
}

/**
 * Validate registration data
 */
function validateRegistration(data) {
  const errors = [];
  
  const bknetIdCheck = validateBknetId(data.bknetId);
  if (!bknetIdCheck.valid) errors.push(bknetIdCheck.message);
  
  const passwordCheck = validatePassword(data.password);
  if (!passwordCheck.valid) errors.push(passwordCheck.message);
  
  const firstNameCheck = validateName(data.firstName, 'First name');
  if (!firstNameCheck.valid) errors.push(firstNameCheck.message);
  
  const lastNameCheck = validateName(data.lastName, 'Last name');
  if (!lastNameCheck.valid) errors.push(lastNameCheck.message);
  
  if (data.role) {
    const roleCheck = validateRole(data.role);
    if (!roleCheck.valid) errors.push(roleCheck.message);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateBknetId,
  validatePassword,
  validateName,
  validateRole,
  sanitizeString,
  validateRegistration,
};
