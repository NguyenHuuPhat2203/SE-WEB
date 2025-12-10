# SSO Authentication Testing Guide

## Overview

This guide helps test the mock HCMUT SSO authentication system with integrated RBAC.

## Architecture

```
User → LoginScreen → SSO Service → Mock SSO Page → Callback Handler → Dashboard
```

## Test Scenarios

### Scenario 1: Student SSO Login (Happy Path)

**Steps:**

1. Navigate to http://localhost/login
2. Click "🎓 Login with HCMUT SSO" button
3. Should redirect to http://localhost:3001/api/sso/login?code=...
4. On SSO page, use demo credentials:
   - BKNET ID: `2052001` (demo student)
   - Password: `student123`
5. Click "Login" button
6. Should redirect to http://localhost/auth/callback?code=...
7. Callback page shows "Processing SSO authentication..."
8. Then shows "Login successful! Redirecting..."
9. Should land on http://localhost/student dashboard

**Expected Permissions:**

```javascript
[
  "view:tutors",
  "view:sessions",
  "view:qa",
  "view:contests",
  "view:courses",
  "view:resources",
  "create:session_request",
  "create:question",
  "create:feedback",
  "view:notifications",
];
```

**Verification:**

- User object in localStorage should have `permissions` array
- JWT token in localStorage should be valid
- Student Home page should render correctly
- Sidebar shows student-specific menu items

---

### Scenario 2: Tutor SSO Login

**Steps:**

1. Navigate to http://localhost/login
2. Click "🎓 Login with HCMUT SSO"
3. Use demo tutor credentials:
   - BKNET ID: `1852001` (demo tutor)
   - Password: `tutor123`
4. Complete login flow

**Expected Permissions:**

```javascript
[
  "view:tutors",
  "view:sessions",
  "view:qa",
  "view:contests",
  "create:contest",
  "manage:own_sessions",
  "answer:questions",
  "view:reports",
  "create:report",
  "view:courses",
  "view:notifications",
];
```

**Verification:**

- Should land on http://localhost/tutor dashboard
- Can create contests (has 'create:contest' permission)
- Can answer questions (has 'answer:questions' permission)
- Can manage own consultation sessions

---

### Scenario 3: CoD Staff Login

**Steps:**

1. Navigate to http://localhost/login
2. Click "🎓 Login with HCMUT SSO"
3. Use demo CoD credentials:
   - BKNET ID: `cod001`
   - Password: `cod123`
4. Complete login flow

**Expected Permissions:**

```javascript
[
  "view:all",
  "manage:courses",
  "manage:staff",
  "view:course_requests",
  "approve:course_requests",
  "view:reports",
  "create:report",
];
```

**Verification:**

- Should land on http://localhost/cod dashboard
- Has 'view:all' permission (can see all resources)
- Can manage courses and staff
- Can approve course requests

---

### Scenario 4: CTSV Staff Login

**Steps:**

1. Navigate to http://localhost/login
2. Click "🎓 Login with HCMUT SSO"
3. Use demo CTSV credentials:
   - BKNET ID: `ctsv001`
   - Password: `ctsv123`
4. Complete login flow

**Expected Permissions:**

```javascript
[
  "view:all",
  "view:reports",
  "evaluate:scholarship",
  "view:performance",
  "create:report",
  "export:data",
  "manage:notifications",
];
```

**Verification:**

- Should land on http://localhost/ctsv dashboard
- Can evaluate scholarships
- Can view performance analytics
- Can export data

---

### Scenario 5: Invalid Credentials

**Steps:**

1. Navigate to http://localhost/login
2. Click SSO button
3. Use wrong password:
   - BKNET ID: `2052001`
   - Password: `wrongpassword`
4. Click Login

**Expected Result:**

- Error message: "Invalid BKNET ID or password"
- Stays on SSO login page
- Red error alert displayed

---

### Scenario 6: Expired Authorization Code

**Steps:**

1. Get SSO login URL with auth code
2. Wait 11 minutes (auth code expires in 10 minutes)
3. Try to complete authentication

**Expected Result:**

- Error message: "Authorization code expired"
- Redirects to /login after 3 seconds

---

### Scenario 7: Legacy Login Fallback

**Steps:**

1. Navigate to http://localhost/login
2. Scroll down below "OR" divider
3. Use legacy login form:
   - BKNET ID: (existing user)
   - Password: (user password)
4. Click "Login" button

**Expected Result:**

- Should still work with original authentication
- Uses POST /api/login endpoint
- No permissions in user object (legacy mode)

---

### Scenario 8: SSO Logout

**Steps:**

1. Login via SSO
2. Navigate to any page
3. Click Logout button

**Expected Result:**

- Calls POST /api/auth/sso/logout
- SSO session terminated in backend
- localStorage cleared
- Redirects to /login

---

## Manual Testing Checklist

### Frontend Tests

- [ ] SSO button visible and prominent on login page
- [ ] SSO button redirects to correct URL
- [ ] Callback page shows processing animation
- [ ] Success state shows checkmark icon
- [ ] Error state shows X icon with message
- [ ] Auto-redirect after 1.5s (success) or 3s (error)
- [ ] Legacy login form still works

### Backend Tests

- [ ] GET /api/auth/sso/login returns authUrl
- [ ] GET /api/sso/login serves HTML page
- [ ] HTML page displays demo credentials
- [ ] POST /api/sso/authenticate validates credentials
- [ ] POST /api/auth/sso/token returns JWT token
- [ ] JWT token contains role and permissions
- [ ] POST /api/auth/sso/logout terminates session
- [ ] GET /api/auth/sso/session validates token

### Permission Tests

- [ ] Student cannot access tutor routes
- [ ] Tutor cannot access CoD routes
- [ ] CoD has view:all permission
- [ ] CTSV has evaluate:scholarship permission
- [ ] Permissions stored in user object
- [ ] hasPermission() function works correctly

### Security Tests

- [ ] Auth codes expire after 10 minutes
- [ ] SSO sessions expire after 24 hours
- [ ] Invalid codes rejected
- [ ] Expired sessions rejected
- [ ] JWT tokens properly signed
- [ ] Passwords not stored in tokens

---

## API Endpoints Reference

### SSO Endpoints

```
GET  /api/auth/sso/login          - Initiate SSO flow
GET  /api/sso/login               - SSO login page
POST /api/sso/authenticate        - Validate credentials
POST /api/auth/sso/token          - Exchange code for token
POST /api/auth/sso/logout         - Logout SSO session
GET  /api/auth/sso/session        - Check session status
```

### Legacy Endpoints (Still Active)

```
POST /api/login                   - Legacy login
POST /api/register                - User registration
GET  /api/me                      - Get current user
```

---

## Demo Credentials

### Students

```
BKNET ID: 2052001
Password: student123
Role: student
Permissions: 10 student-level permissions
```

### Tutors

```
BKNET ID: 1852001
Password: tutor123
Role: tutor
Permissions: 11 tutor-level permissions
```

### CoD Staff

```
BKNET ID: cod001
Password: cod123
Role: cod
Permissions: 7 permissions including view:all
```

### CTSV Staff

```
BKNET ID: ctsv001
Password: ctsv123
Role: ctsv
Permissions: 7 permissions including evaluate:scholarship
```

---

## Troubleshooting

### Issue: "Invalid authorization code"

**Cause:** Auth code not found or already used
**Solution:** Restart SSO flow from login page

### Issue: "Authorization code expired"

**Cause:** Code older than 10 minutes
**Solution:** Click SSO button again to get new code

### Issue: Callback page stuck on "Processing..."

**Cause:** Network error or backend not running
**Solution:**

1. Check backend is running on port 3001
2. Check browser console for errors
3. Verify /api/auth/sso/token endpoint works

### Issue: "Network error. Please try again."

**Cause:** Backend server not reachable
**Solution:**

1. Verify server running: `cd server && npm start`
2. Check port 3001 is not blocked
3. Check CORS settings if using different ports

### Issue: Permissions not working

**Cause:** User object doesn't have permissions array
**Solution:**

1. Check JWT token has permissions claim
2. Verify ssoService.getRolePermissions() returns correct array
3. Check AuthContext.loginWithSSO() stores permissions

---

## Next Steps After Testing

### 1. Apply RBAC Middleware to Routes

Update `server.js` to protect routes:

```javascript
// Example: Protect contest creation
app.post(
  "/api/addcontest",
  authenticate,
  requirePermission("create:contest"),
  contestController.addContest
);

// Example: Protect course management
app.get(
  "/api/courses",
  authenticate,
  requireRole("cod", "ctsv"),
  courseController.getAllCourses
);
```

### 2. Add Frontend Permission Checks

Create `usePermission` hook:

```typescript
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission ? hasPermission(permission) : false;
}

// Usage in component:
const canCreateContest = usePermission("create:contest");
```

### 3. Conditionally Render UI Elements

```tsx
{
  canCreateContest && (
    <Button onClick={handleCreateContest}>Create Contest</Button>
  );
}
```

### 4. Production Considerations

- Replace in-memory storage with Redis
- Add rate limiting to SSO endpoints
- Implement proper SSO session management
- Add audit logging for authentication events
- Configure proper token expiration times
- Add refresh token mechanism

---

## Success Criteria

✅ All 8 test scenarios pass
✅ Permissions correctly assigned per role
✅ Auth codes expire properly
✅ SSO sessions tracked correctly
✅ JWT tokens contain role and permissions
✅ Legacy login still functional
✅ Logout terminates SSO session
✅ Callback page handles all states (processing, success, error)

---

## Contact

For issues or questions, check:

1. Backend logs: `server/logs/`
2. Browser console: F12 → Console tab
3. Network tab: F12 → Network tab
4. Redux DevTools (if applicable)

**Last Updated:** 2025-01-XX
**Version:** 1.0
