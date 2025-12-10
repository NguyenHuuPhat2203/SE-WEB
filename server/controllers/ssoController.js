// controllers/ssoController.js - SSO Authentication Controller
const ssoService = require("../services/ssoService");
const config = require("../utils/config");

/**
 * Step 1: Initiate SSO Login
 * GET /api/auth/sso/login
 * Client calls this to start SSO flow
 */
exports.initiateLogin = (req, res) => {
  try {
    const redirectUri =
      req.query.redirect_uri || `${config.corsOrigin}/auth/callback`;
    const state = req.query.state || Math.random().toString(36).substring(7);

    const { authUrl, authCode } = ssoService.generateAuthorizationUrl(
      redirectUri,
      state
    );

    res.json({
      success: true,
      data: {
        authUrl,
        state,
      },
    });
  } catch (error) {
    console.error("SSO initiate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate SSO login",
    });
  }
};

/**
 * Step 2: SSO Login Page (Mock)
 * GET /api/sso/login
 * This serves a simple HTML page for SSO authentication
 * In production, this would be HCMUT_SSO's login page
 */
exports.showLoginPage = (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  // Serve HTML login page
  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HCMUT SSO - Đăng nhập</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 100%;
          padding: 40px;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo h1 {
          color: #667eea;
          font-size: 32px;
          margin-bottom: 8px;
        }
        .logo p {
          color: #666;
          font-size: 14px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          color: #333;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
        }
        input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #667eea;
        }
        button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        button:active {
          transform: translateY(0);
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .error {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          display: none;
        }
        .error.show {
          display: block;
        }
        .info {
          background: #e3f2fd;
          color: #1976d2;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 13px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #999;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h1>🎓 HCMUT SSO</h1>
          <p>Ho Chi Minh University of Technology</p>
        </div>

        <div class="info">
          <strong>Demo Credentials:</strong><br>
          Student: student / password<br>
          Tutor: tutor / password<br>
          CoD: cod / password<br>
          CTSV: ctsv / password
        </div>

        <div id="error" class="error"></div>

        <form id="loginForm">
          <div class="form-group">
            <label for="bknetId">BKNet ID</label>
            <input 
              type="text" 
              id="bknetId" 
              name="bknetId" 
              placeholder="e.g., student"
              required 
              autofocus
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password"
              required 
            />
          </div>

          <button type="submit" id="submitBtn">Đăng nhập</button>
        </form>

        <div class="footer">
          © 2025 HCMUT. Mock SSO for Development.
        </div>
      </div>

      <script>
        const form = document.getElementById('loginForm');
        const errorDiv = document.getElementById('error');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const bknetId = document.getElementById('bknetId').value.trim();
          const password = document.getElementById('password').value;
          
          if (!bknetId || !password) {
            showError('Please enter both BKNet ID and password');
            return;
          }

          submitBtn.disabled = true;
          submitBtn.textContent = 'Đang xác thực...';
          errorDiv.classList.remove('show');

          try {
            const response = await fetch('/api/sso/authenticate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                authCode: '${code}',
                bknetId,
                password,
              }),
            });

            const data = await response.json();

            if (data.success) {
              // Redirect back to application with code
              const redirectUrl = data.data.redirectUrl;
              window.location.href = redirectUrl;
            } else {
              showError(data.message || 'Authentication failed');
              submitBtn.disabled = false;
              submitBtn.textContent = 'Đăng nhập';
            }
          } catch (error) {
            showError('Network error. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Đăng nhập';
          }
        });

        function showError(message) {
          errorDiv.textContent = message;
          errorDiv.classList.add('show');
        }
      </script>
    </body>
    </html>
  `);
};

/**
 * Step 3: Authenticate with SSO
 * POST /api/sso/authenticate
 * User submits credentials to SSO
 */
exports.authenticate = async (req, res) => {
  try {
    const { authCode, bknetId, password } = req.body;

    if (!authCode || !bknetId || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const result = await ssoService.authenticateUser(
      authCode,
      bknetId,
      password
    );

    // Get redirect URI from original auth request
    const authRequest = ssoService.pendingAuthorizations.get(authCode);
    const redirectUri =
      authRequest?.redirectUri || `${config.corsOrigin}/auth/callback`;
    const state = authRequest?.state || "";

    // Construct redirect URL with auth code
    const redirectUrl = `${redirectUri}?code=${authCode}&state=${state}`;

    res.json({
      success: true,
      data: {
        redirectUrl,
        message: "Authentication successful",
      },
    });
  } catch (error) {
    console.error("SSO authenticate error:", error);

    let message = "Authentication failed";
    let statusCode = 401;

    if (error.message === "INVALID_AUTH_CODE") {
      message = "Invalid authorization code";
      statusCode = 400;
    } else if (error.message === "AUTH_CODE_EXPIRED") {
      message = "Authorization code expired. Please try again.";
      statusCode = 400;
    } else if (error.message === "INVALID_CREDENTIALS") {
      message = "Invalid BKNet ID or password";
    } else if (error.message === "INSUFFICIENT_PERMISSIONS") {
      message = "You do not have permission to access this system";
      statusCode = 403;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * Step 4: Exchange code for token
 * POST /api/auth/sso/token
 * Backend exchanges authorization code for access token
 */
exports.exchangeToken = async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    const result = await ssoService.exchangeCodeForToken(code);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Token exchange error:", error);

    let message = "Failed to exchange token";
    let statusCode = 400;

    if (error.message === "INVALID_AUTH_CODE") {
      message = "Invalid or expired authorization code";
    } else if (error.message === "AUTH_CODE_NOT_USED") {
      message = "Authorization code not yet authenticated";
    } else if (error.message === "INVALID_SSO_SESSION") {
      message = "Invalid SSO session";
      statusCode = 401;
    } else if (error.message === "USER_NOT_FOUND") {
      message = "User not found";
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

/**
 * SSO Logout
 * POST /api/auth/sso/logout
 */
exports.logout = async (req, res) => {
  try {
    const { ssoToken } = req.body;

    if (ssoToken) {
      ssoService.logout(ssoToken);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("SSO logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * Check SSO session
 * GET /api/auth/sso/session
 */
exports.checkSession = async (req, res) => {
  try {
    const { ssoToken } = req.query;

    if (!ssoToken) {
      return res.status(400).json({
        success: false,
        message: "SSO token is required",
      });
    }

    const session = ssoService.validateSSOSession(ssoToken);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired SSO session",
      });
    }

    res.json({
      success: true,
      data: {
        valid: true,
        session: {
          bknetId: session.bknetId,
          role: session.role,
          permissions: session.permissions,
        },
      },
    });
  } catch (error) {
    console.error("Check session error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check session",
    });
  }
};
