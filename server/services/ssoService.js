// services/ssoService.js - Mock HCMUT SSO Service
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const userRepositoryMongo = require("../repositories/userRepositoryMongo");

/**
 * Mock HCMUT SSO Service
 * Simulates an external SSO provider (like HCMUT_SSO)
 * In production, this would be replaced with real SSO integration
 */
class SSOService {
  constructor() {
    // Store pending authorization requests (in-memory for demo)
    // In production, use Redis or database
    this.pendingAuthorizations = new Map();
    this.ssoSessions = new Map();
  }

  /**
   * Generate SSO authorization URL
   * Step 1: Client redirects user to SSO login page
   */
  generateAuthorizationUrl(redirectUri, state) {
    const authCode = crypto.randomBytes(32).toString("hex");

    // Store authorization request
    this.pendingAuthorizations.set(authCode, {
      redirectUri,
      state,
      createdAt: Date.now(),
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Return SSO authorization URL (our mock SSO page)
    return {
      authUrl: `${config.ssoBaseUrl}/api/sso/login?code=${authCode}&state=${state}`,
      authCode,
    };
  }

  /**
   * Authenticate user with SSO credentials
   * Step 2: User submits credentials to SSO provider
   * This simulates HCMUT_SSO validating credentials
   */
  async authenticateUser(authCode, bknetId, password) {
    // Verify auth code exists
    const authRequest = this.pendingAuthorizations.get(authCode);
    if (!authRequest) {
      throw new Error("INVALID_AUTH_CODE");
    }

    // Check expiration
    if (Date.now() > authRequest.expiresAt) {
      this.pendingAuthorizations.delete(authCode);
      throw new Error("AUTH_CODE_EXPIRED");
    }

    // Authenticate against our user database
    // In production, this would call real HCMUT_SSO API
    const user = await userRepositoryMongo.findByBknetId(bknetId);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Check if user has necessary permissions (role-based)
    if (!this.isRoleAuthorized(user.role)) {
      throw new Error("INSUFFICIENT_PERMISSIONS");
    }

    // Generate SSO session token
    const ssoToken = crypto.randomBytes(32).toString("hex");

    // Store SSO session
    this.ssoSessions.set(ssoToken, {
      userId: user._id.toString(),
      bknetId: user.bknetId,
      role: user.role,
      permissions: this.getRolePermissions(user.role),
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Mark auth code as used
    authRequest.ssoToken = ssoToken;
    authRequest.userId = user._id.toString();

    return {
      ssoToken,
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
      },
    };
  }

  /**
   * Exchange authorization code for access token
   * Step 3: Backend exchanges code for token
   */
  async exchangeCodeForToken(authCode) {
    const authRequest = this.pendingAuthorizations.get(authCode);
    if (!authRequest) {
      throw new Error("INVALID_AUTH_CODE");
    }

    if (!authRequest.ssoToken) {
      throw new Error("AUTH_CODE_NOT_USED");
    }

    // Get SSO session
    const ssoSession = this.ssoSessions.get(authRequest.ssoToken);
    if (!ssoSession) {
      throw new Error("INVALID_SSO_SESSION");
    }

    // Get user details
    const user = await userRepositoryMongo.findById(ssoSession.userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // Generate JWT access token with role and permissions
    const accessToken = jwt.sign(
      {
        id: user._id,
        bknetId: user.bknetId,
        role: user.role,
        permissions: ssoSession.permissions,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expire }
    );

    // Generate refresh token
    const refreshToken = crypto.randomBytes(32).toString("hex");

    // Clean up used auth code
    this.pendingAuthorizations.delete(authCode);

    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: 7 * 24 * 60 * 60, // 7 days
      user: {
        id: user._id,
        bknetId: user.bknetId,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        permissions: ssoSession.permissions,
      },
    };
  }

  /**
   * Validate SSO session
   */
  validateSSOSession(ssoToken) {
    const session = this.ssoSessions.get(ssoToken);
    if (!session) {
      return null;
    }

    // Check expiration
    if (Date.now() > session.expiresAt) {
      this.ssoSessions.delete(ssoToken);
      return null;
    }

    return session;
  }

  /**
   * Logout from SSO
   */
  logout(ssoToken) {
    this.ssoSessions.delete(ssoToken);
  }

  /**
   * Check if role is authorized to access system
   */
  isRoleAuthorized(role) {
    const authorizedRoles = ["student", "tutor", "cod", "ctsv"];
    return authorizedRoles.includes(role);
  }

  /**
   * Get permissions for role (RBAC)
   */
  getRolePermissions(role) {
    const permissions = {
      student: [
        "view:courses",
        "view:tutors",
        "view:sessions",
        "view:contests",
        "view:qa",
        "create:qa",
        "register:contest",
        "register:session",
        "view:own-profile",
        "edit:own-profile",
      ],
      tutor: [
        "view:courses",
        "view:sessions",
        "view:contests",
        "view:qa",
        "create:qa",
        "answer:qa",
        "create:session",
        "edit:session",
        "create:contest",
        "view:own-profile",
        "edit:own-profile",
        "view:students",
      ],
      cod: [
        "view:all",
        "manage:courses",
        "manage:staff",
        "manage:tutors",
        "view:reports",
        "export:reports",
        "view:own-profile",
        "edit:own-profile",
      ],
      ctsv: [
        "view:all",
        "manage:scholarships",
        "evaluate:students",
        "view:reports",
        "export:reports",
        "view:own-profile",
        "edit:own-profile",
      ],
    };

    return permissions[role] || [];
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(userPermissions, requiredPermission) {
    return (
      userPermissions.includes(requiredPermission) ||
      userPermissions.includes("view:all")
    );
  }

  /**
   * Cleanup expired sessions (run periodically)
   */
  cleanupExpiredSessions() {
    const now = Date.now();

    // Cleanup expired authorizations
    for (const [code, auth] of this.pendingAuthorizations.entries()) {
      if (now > auth.expiresAt) {
        this.pendingAuthorizations.delete(code);
      }
    }

    // Cleanup expired SSO sessions
    for (const [token, session] of this.ssoSessions.entries()) {
      if (now > session.expiresAt) {
        this.ssoSessions.delete(token);
      }
    }
  }
}

// Singleton instance
const ssoService = new SSOService();

// Cleanup expired sessions every 10 minutes
setInterval(() => {
  ssoService.cleanupExpiredSessions();
}, 10 * 60 * 1000);

module.exports = ssoService;
