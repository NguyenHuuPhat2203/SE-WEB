// controllers/authController.js
const authService = require('../services/authService');
const { 
  successResponse, 
  errorResponse, 
  validationErrorResponse,
  unauthorizedResponse,
  serverErrorResponse 
} = require('../utils/response');

exports.register = async (req, res) => {
  console.log('[REGISTER] body =', req.body);
  try {
    const { user, token } = await authService.register(req.body);

    return successResponse(res, {
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    }, 201);
  } catch (err) {
    if (err.message === 'VALIDATION_ERROR') {
      return validationErrorResponse(res, err.errors);
    }
    if (err.message === 'USER_EXISTS') {
      return errorResponse(res, 'BKnetID already registered', 409);
    }
    return serverErrorResponse(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);

    return successResponse(res, {
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return errorResponse(res, 'Missing bknetId or password', 400);
    }
    if (err.message === 'INVALID_CREDENTIALS') {
      return unauthorizedResponse(res, 'Invalid credentials');
    }
    return serverErrorResponse(res, err);
  }
};

exports.searchAccount = async (req, res) => {
  try {
    await authService.findAccount(req.body);
    return successResponse(res, { message: 'Account found' });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return errorResponse(res, 'Missing bknetId', 400);
    }
    if (err.message === 'USER_NOT_FOUND') {
      return errorResponse(res, 'Account not found', 404);
    }
    return serverErrorResponse(res, err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);
    return successResponse(res, { message: 'Password reset successfully' });
  } catch (err) {
    if (err.message === 'MISSING_FIELDS') {
      return errorResponse(res, 'Missing fields', 400);
    }
    if (err.message === 'INVALID_CAPTCHA') {
      return errorResponse(res, 'Invalid CAPTCHA', 400);
    }
    if (err.message === 'USER_NOT_FOUND') {
      return errorResponse(res, 'Account not found', 404);
    }
    return serverErrorResponse(res, err);
  }
};
