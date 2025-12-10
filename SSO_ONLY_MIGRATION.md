# Migration to SSO-Only Authentication

## 📋 Summary

Đã loại bỏ hoàn toàn hệ thống đăng nhập/đăng ký truyền thống, chỉ giữ lại **HCMUT SSO** làm phương thức xác thực duy nhất.

---

## ✅ Changes Made

### 1. Frontend Changes

#### 1.1. LoginScreen.tsx - Simplified to SSO Only

**File:** `src/components/auth/LoginScreen.tsx`

**Removed:**

- ❌ Legacy login form (bknetId/password inputs)
- ❌ Register button/link
- ❌ Forgot password link
- ❌ Demo role selector
- ❌ Error dialog for wrong credentials
- ❌ Imports: `Link`, `Input`, `Label`, `AlertDialog` components
- ❌ `useAuth()` hook (không còn dùng `login()` method)
- ❌ State: `bknetId`, `password`, `showErrorDialog`, `selectedRole`
- ❌ Function: `handleLegacyLogin()`

**Kept:**

- ✅ SSO login button (prominent, centered)
- ✅ Demo credentials display (in info box)
- ✅ `handleSSOLogin()` function
- ✅ Error handling for SSO failures
- ✅ Beautiful gradient design

**New UI:**

```tsx
// Prominent SSO button
<Button className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-600">
  🎓 Login with HCMUT SSO
</Button>

// Demo credentials info box
<div className="bg-blue-50 border border-blue-200">
  <p>Demo Credentials:</p>
  <ul>
    <li>Student: 2052001 / student123</li>
    <li>Tutor: 1852001 / tutor123</li>
    <li>CoD: cod001 / cod123</li>
    <li>CTSV: ctsv001 / ctsv123</li>
  </ul>
</div>
```

#### 1.2. Routes - Removed Register & Recovery

**File:** `src/routes/index.tsx`

**Removed Routes:**

- ❌ `/register` → `<RegisterScreen />`
- ❌ `/recover-password` → `<PasswordRecoveryScreen />`

**Removed Imports:**

- ❌ `RegisterScreen`
- ❌ `PasswordRecoveryScreen`

**Kept Routes:**

- ✅ `/login` → `<LoginScreen />` (SSO only)
- ✅ `/auth/callback` → `<SSOCallbackScreen />`

#### 1.3. AuthContext - Removed Legacy Login

**File:** `src/contexts/AuthContext.tsx`

**Interface Changes:**

```typescript
// BEFORE
interface AuthContextType {
  user: User | null;
  login: (bknetId: string, password: string) => Promise<void>; // ❌ Removed
  loginWithSSO?: (token: string, user: any) => Promise<void>; // Was optional
  logout: () => void;
  isLoading: boolean;
  hasPermission?: (permission: string) => boolean; // Was optional
}

// AFTER
interface AuthContextType {
  user: User | null;
  loginWithSSO: (token: string, user: any) => Promise<void>; // ✅ Required
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean; // ✅ Required
}
```

**Removed Functions:**

- ❌ `login(bknetId, password)` - Legacy login method

**Updated Functions:**

- ✅ `verifyToken()` - Now includes `permissions` from SSO token
- ✅ `loginWithSSO()` - Now required (not optional)
- ✅ `hasPermission()` - Now required (not optional)

**Provider Changes:**

```typescript
// BEFORE
<AuthContext.Provider value={{ user, login, loginWithSSO, logout, isLoading, hasPermission }}>

// AFTER
<AuthContext.Provider value={{ user, loginWithSSO, logout, isLoading, hasPermission }}>
```

---

### 2. Backend Changes

#### 2.1. Server Routes - Removed Legacy Endpoints

**File:** `server/server.js`

**Removed Routes:**

```javascript
// ❌ Removed all legacy authentication routes
app.post("/api/login", authController.login);
app.post("/api/register", authController.register);
app.post("/api/password/search", authController.searchAccount);
app.post("/api/password/reset", authController.resetPassword);
```

**Kept Routes:**

```javascript
// ✅ SSO routes (all kept)
app.get("/api/auth/sso/login", ssoController.initiateLogin);
app.get("/api/sso/login", ssoController.showLoginPage);
app.post("/api/sso/authenticate", ssoController.authenticate);
app.post("/api/auth/sso/token", ssoController.exchangeToken);
app.post("/api/auth/sso/logout", ssoController.logout);
app.get("/api/auth/sso/session", ssoController.checkSession);

// ✅ User profile routes
app.get("/api/me", protect, userController.getCurrentUser);
app.patch("/api/users/:bknetId/profile", protect, userController.updateProfile);
```

**Note:** `authController` import vẫn giữ nhưng không được sử dụng. Có thể xóa sau nếu không cần.

---

## 🔄 Authentication Flow (After Migration)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ User visits /login
       ↓
┌─────────────────┐
│  LoginScreen    │ ← Only shows SSO button
│  (SSO Only)     │   + Demo credentials
└──────┬──────────┘
       │ Click "🎓 Login with HCMUT SSO"
       ↓
┌─────────────────────┐
│ GET /api/auth/sso/  │ ← Backend generates auth URL
│      login          │   with authorization code
└──────┬──────────────┘
       │ Redirect to SSO login page
       ↓
┌─────────────────────┐
│  Mock SSO Login     │ ← Embedded HTML page
│  (Simulated HCMUT)  │   /api/sso/login?code=xxx
└──────┬──────────────┘
       │ User enters BKnet ID + Password
       │ POST /api/sso/authenticate
       ↓
┌─────────────────────┐
│   SSO Service       │ ← Validates credentials
│   (Backend)         │   Creates SSO session
└──────┬──────────────┘
       │ Success, redirect with code
       ↓
┌─────────────────────┐
│ SSOCallbackScreen   │ ← Parse code from URL
│   (Frontend)        │   POST /api/auth/sso/token
└──────┬──────────────┘
       │ Exchange code for JWT token
       ↓
┌─────────────────────┐
│   JWT Token         │ ← Contains: userId, role, permissions
│   (7-day expiry)    │   Stored in localStorage
└──────┬──────────────┘
       │ Call loginWithSSO(token, user)
       ↓
┌─────────────────────┐
│  Role Dashboard     │ ← Navigate based on role:
│  (Protected Route)  │   student → /student
└─────────────────────┘   tutor → /tutor
                          cod → /cod
                          ctsv → /ctsv
```

---

## 🔐 Available Demo Accounts

All authentication must go through SSO. No direct database login available.

| Role    | BKnet ID | Password   | Permissions Count | Dashboard |
| ------- | -------- | ---------- | ----------------- | --------- |
| Student | 2052001  | student123 | 10 permissions    | /student  |
| Tutor   | 1852001  | tutor123   | 11 permissions    | /tutor    |
| CoD     | cod001   | cod123     | 7 (+ view:all)    | /cod      |
| CTSV    | ctsv001  | ctsv123    | 7 (+ view:all)    | /ctsv     |

---

## 📁 Files Modified

### Modified Files (5)

1. ✏️ `src/components/auth/LoginScreen.tsx` - Simplified to SSO only
2. ✏️ `src/routes/index.tsx` - Removed register/recovery routes
3. ✏️ `src/contexts/AuthContext.tsx` - Removed legacy login method
4. ✏️ `server/server.js` - Removed legacy auth endpoints
5. ✏️ `SSO_ONLY_MIGRATION.md` - This documentation

### Files To Delete (Optional)

These files are no longer used but can be kept for reference:

- 🗑️ `src/components/auth/RegisterScreen.tsx` (not imported anymore)
- 🗑️ `src/components/auth/PasswordRecoveryScreen.tsx` (not imported anymore)
- 🗑️ `server/controllers/authController.js` (endpoints removed, but file exists)

**Recommendation:** Keep files for now in case rollback needed, delete later after testing.

---

## ⚠️ Breaking Changes

### For Frontend Developers

1. **`useAuth()` hook no longer has `login()` method**

   - ❌ Old: `const { login } = useAuth(); await login(bknetId, password);`
   - ✅ New: SSO only via redirect flow

2. **No registration flow available**

   - Users must be pre-created in database
   - Use SSO demo accounts for testing

3. **Password recovery removed**
   - No `/recover-password` route
   - Password reset must be handled externally (if needed)

### For Backend Developers

1. **Legacy auth endpoints removed**

   - ❌ `POST /api/login` - No longer available
   - ❌ `POST /api/register` - No longer available
   - ❌ `POST /api/password/search` - No longer available
   - ❌ `POST /api/password/reset` - No longer available

2. **All authentication must use SSO flow**
   - Users must authenticate via `/api/auth/sso/login` → `/api/sso/authenticate` → `/api/auth/sso/token`

---

## 🧪 Testing After Migration

### Test 1: SSO Login Works

1. Navigate to `http://localhost/login`
2. Should see only SSO button (no username/password form)
3. Click "🎓 Login with HCMUT SSO"
4. Should redirect to mock SSO page
5. Enter demo credentials (e.g., 2052001 / student123)
6. Should redirect to `/auth/callback` → then `/student` dashboard

**Expected Result:** ✅ SSO login flow completes successfully

### Test 2: Legacy Login No Longer Works

1. Try to POST to `http://localhost:3001/api/login`
   ```bash
   curl -X POST http://localhost:3001/api/login \
     -H "Content-Type: application/json" \
     -d '{"bknetId":"2052001","password":"student123"}'
   ```

**Expected Result:** ❌ 404 Not Found (route removed)

### Test 3: Register Route No Longer Accessible

1. Navigate to `http://localhost/register`

**Expected Result:** ❌ 404 Not Found (route removed)

### Test 4: Password Recovery No Longer Accessible

1. Navigate to `http://localhost/recover-password`

**Expected Result:** ❌ 404 Not Found (route removed)

### Test 5: Permissions Work After SSO Login

1. Login via SSO as Student (2052001)
2. Check `localStorage.getItem('token')`
3. Decode JWT token
4. Should contain `permissions` array with 10 student permissions

**Expected Result:** ✅ Permissions loaded correctly

---

## 🔄 Rollback Plan (If Needed)

If you need to restore legacy authentication:

### Frontend Rollback

1. Revert `LoginScreen.tsx` to include legacy form
2. Revert `routes/index.tsx` to include `/register` and `/recover-password`
3. Revert `AuthContext.tsx` to include `login()` method
4. Re-import `RegisterScreen` and `PasswordRecoveryScreen`

### Backend Rollback

1. Revert `server.js` to include legacy routes:
   ```javascript
   app.post("/api/login", authController.login);
   app.post("/api/register", authController.register);
   app.post("/api/password/search", authController.searchAccount);
   app.post("/api/password/reset", authController.resetPassword);
   ```

---

## 📊 Impact Summary

### Before Migration

- ✅ Legacy login (BKnetID + password)
- ✅ Registration form
- ✅ Password recovery
- ✅ SSO login (as alternative)

### After Migration

- ❌ Legacy login removed
- ❌ Registration removed
- ❌ Password recovery removed
- ✅ SSO login (only method)

### Benefits

- ✅ Simplified authentication flow
- ✅ Single source of truth (SSO only)
- ✅ Better security (no password in database queries)
- ✅ Consistent with requirements (HCMUT SSO mock)
- ✅ Cleaner codebase (less authentication logic)

### Trade-offs

- ⚠️ Must pre-create users in database (no self-registration)
- ⚠️ Password reset must be external (if needed)
- ⚠️ Cannot test without running SSO mock server

---

## 🚀 Next Steps

### Immediate (Required)

1. ✅ Test SSO login with all 4 demo accounts
2. ✅ Verify permissions loaded correctly
3. ✅ Test logout functionality
4. ✅ Verify token refresh/expiration

### Soon (Recommended)

1. 🔄 Delete unused files:

   - `RegisterScreen.tsx`
   - `PasswordRecoveryScreen.tsx`
   - Unused imports in `authController.js`

2. 🔄 Update documentation:

   - README.md - Remove registration instructions
   - User guide - Only SSO authentication

3. 🔄 Add user creation script:
   - Script to add new users to database
   - Required since no registration form

### Later (Optional)

1. 📝 Add admin panel for user management
2. 📝 Implement password reset via admin
3. 📝 Add audit logging for SSO authentication

---

## 📞 Support

**Testing SSO:**

- Use demo credentials from `LoginScreen` info box
- Check browser console for errors
- Check backend logs for authentication flow

**Issues:**

- SSO login page not loading → Check backend running on port 3001
- Token not stored → Check `loginWithSSO()` in AuthContext
- Permissions not working → Check JWT token contains permissions array

---

**Migration Date:** January 11, 2025  
**Migration By:** GitHub Copilot  
**Status:** ✅ Complete  
**Rollback Available:** Yes (see Rollback Plan)

---

_End of Migration Document_
