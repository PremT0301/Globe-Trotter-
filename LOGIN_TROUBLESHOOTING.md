# 🔍 Login Issue Troubleshooting Guide

## 🚨 Problem
The login page is showing "Invalid email or password" error.

## ✅ What We Know
- ✅ Backend server is running correctly on port 4000
- ✅ Admin user exists in database
- ✅ Backend login API works (tested with curl/axios)
- ✅ CORS is configured correctly
- ✅ Database connection is working

## 🔧 Debugging Steps

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try to login with admin credentials:
   - Email: `admin@globetrotter.com`
   - Password: `admin123456`
4. Look for console messages starting with:
   - `🔧 API Configuration:`
   - `🌐 Making request:`
   - `📡 Response received:`
   - `🔐 Attempting login with:`
   - `❌ Login failed:`

### Step 2: Check Network Tab
1. In Developer Tools, go to the Network tab
2. Try to login again
3. Look for the request to `/api/auth/login`
4. Check:
   - Request URL: Should be `http://localhost:4000/api/auth/login`
   - Request Method: Should be `POST`
   - Request Headers: Should include `Content-Type: application/json`
   - Request Payload: Should contain email and password
   - Response Status: Should be 200 for success, 401 for failure

### Step 3: Verify Frontend Server
1. Make sure frontend is running: `cd Frontend && npm run dev`
2. Check if frontend is accessible at `http://localhost:5173`
3. Verify no console errors on page load

### Step 4: Test with Different Credentials
Try these test cases:

#### Test Case 1: Admin Login
- Email: `admin@globetrotter.com`
- Password: `admin123456`
- Expected: Success

#### Test Case 2: Regular User Login
- Email: `testuser@example.com`
- Password: `password123`
- Expected: Success

#### Test Case 3: Wrong Password
- Email: `admin@globetrotter.com`
- Password: `wrongpassword`
- Expected: "Invalid email or password" error

#### Test Case 4: Non-existent Email
- Email: `nonexistent@example.com`
- Password: `password123`
- Expected: "Invalid email or password" error

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Symptoms**: Console shows CORS error
**Solution**: Backend CORS is already configured correctly

### Issue 2: Network Error
**Symptoms**: Console shows "Failed to fetch" or network error
**Solution**: 
1. Make sure backend is running: `cd Backend && npm run dev`
2. Check if backend is accessible at `http://localhost:4000`

### Issue 3: API URL Mismatch
**Symptoms**: Requests going to wrong URL
**Solution**: Check `Frontend/src/lib/api.ts` - BASE_URL should be `http://localhost:4000`

### Issue 4: Environment Variables
**Symptoms**: API configuration shows wrong URL
**Solution**: Check if `VITE_API_URL` is set in `.env` file

### Issue 5: Database Connection
**Symptoms**: Backend logs show database errors
**Solution**: Check MongoDB connection in backend

## 🔍 Debug Information

### Backend Status
- ✅ Server running on port 4000
- ✅ Database connected
- ✅ Admin user exists
- ✅ Login API working

### Frontend Configuration
- API Base URL: `http://localhost:4000`
- CORS: Enabled
- Debug logging: Added

### Test Results
- ✅ Backend connectivity: Working
- ✅ Admin login: Working
- ✅ Regular user login: Working
- ✅ Wrong credentials: Properly rejected
- ✅ CORS: Configured correctly

## 🚀 Quick Fixes to Try

### Fix 1: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 2: Check Local Storage
1. Open Developer Tools (F12)
2. Go to Application tab
3. Check Local Storage for any old tokens
4. Clear if necessary

### Fix 3: Restart Servers
1. Stop both frontend and backend servers
2. Start backend: `cd Backend && npm run dev`
3. Start frontend: `cd Frontend && npm run dev`

### Fix 4: Check Port Conflicts
1. Make sure nothing else is using port 4000
2. Make sure nothing else is using port 5173

## 📞 Next Steps

If the issue persists after trying these steps:

1. **Share Console Logs**: Copy all console messages when trying to login
2. **Share Network Tab**: Screenshot the network request/response
3. **Check Environment**: Make sure both servers are running
4. **Test Credentials**: Try the exact credentials listed above

## 🎯 Expected Behavior

When you login with `admin@globetrotter.com` / `admin123456`:

1. Console should show:
   ```
   🔧 API Configuration: { BASE_URL: "http://localhost:4000" }
   🌐 Making request: { method: "POST", url: "http://localhost:4000/api/auth/login" }
   📡 Response received: { status: 200 }
   ✅ Request successful: { token: "...", user: {...} }
   🔐 Attempting login with: { email: "admin@globetrotter.com" }
   ✅ Login successful: { user: {...}, token: "..." }
   ✅ Login completed successfully
   ```

2. You should be redirected to `/dashboard`
3. You should see "Welcome back!" toast message
4. Admin panel link should appear in navbar

---

**💡 If you're still having issues, please share the console logs and we'll debug further!**
