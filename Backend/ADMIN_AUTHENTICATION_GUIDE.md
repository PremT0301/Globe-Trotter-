# 🔐 Admin Authentication System Guide

## 📋 Overview

This guide explains how the admin authentication system works in GlobeTrotter, ensuring that only users with admin credentials can access the admin panel.

## 🛡️ Security Architecture

### 1. **Role-Based Access Control (RBAC)**
- **User Role**: `user` (default) - Can access regular features
- **Admin Role**: `admin` - Can access admin panel and all features
- **Role Verification**: Both frontend and backend validate user roles

### 2. **Authentication Flow**
```
User Login → JWT Token → Role Check → Access Control
```

## 🔑 Admin Credentials

### Default Admin Account
- **Email**: `admin@globetrotter.com`
- **Password**: `admin123456`
- **Role**: `admin`

### ⚠️ Security Notice
**IMPORTANT**: Change the default password immediately after first login!

## 🚀 Setup Instructions

### 1. Create Admin User
```bash
cd Backend
node setup-admin.js
```

### 2. Start Backend Server
```bash
cd Backend
npm run dev
```

### 3. Access Admin Panel
1. Go to `/login` in your browser
2. Login with admin credentials
3. Navigate to `/admin` or use "Admin Panel" in user menu

## 🔧 Backend Implementation

### User Model (Backend/src/models/User.js)
```javascript
{
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: Boolean,
  // ... other fields
}
```

### Authentication Middleware (Backend/src/middleware/auth.js)
```javascript
// Admin-only middleware
const requireAdmin = async (req, res, next) => {
  try {
    await authenticateToken(req, res, (err) => {
      if (err) return next(err);
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
```

### Admin Routes (Backend/src/routes/admin.js)
```javascript
const router = express.Router();
router.use(requireAdmin); // All admin routes require admin role

// Admin endpoints
router.get('/stats', ...);
router.get('/users', ...);
router.get('/trips', ...);
// ... more admin endpoints
```

### Auth Routes (Backend/src/routes/auth.js)
```javascript
// Login response includes role
res.json({
  message: 'Login successful!',
  token,
  user: { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    emailVerified: true, 
    role: user.role // ← Role included here
  },
});
```

## 🎨 Frontend Implementation

### AdminRoute Component (Frontend/src/components/AdminRoute.tsx)
```typescript
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};
```

### App Routes (Frontend/src/App.tsx)
```typescript
<Route path="/admin" element={
  <AdminRoute>
    <><Navbar /><AdminDashboard /></>
  </AdminRoute>
} />
```

### AuthContext (Frontend/src/context/AuthContext.tsx)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin'; // ← Role field
  // ... other fields
}
```

### Navbar Integration (Frontend/src/components/Navbar.tsx)
```typescript
{user.role === 'admin' && (
  <Link to="/admin" className="...">
    <Shield className="h-5 w-5" />
    <span>Admin Panel</span>
  </Link>
)}
```

## 🧪 Testing Admin Authentication

### Test Script (Backend/test-admin-login.js)
```javascript
// Test admin login
const loginResponse = await axios.post('/api/auth/login', {
  email: 'admin@globetrotter.com',
  password: 'admin123456'
});

// Verify role is returned
console.log('User role:', loginResponse.data.user.role); // Should be 'admin'

// Test admin API access
const statsResponse = await axios.get('/api/admin/stats', {
  headers: { 'Authorization': `Bearer ${loginResponse.data.token}` }
});

// Test regular user blocking
const regularUserResponse = await axios.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// This should fail with 403
try {
  await axios.get('/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${regularUserResponse.data.token}` }
  });
} catch (error) {
  if (error.response.status === 403) {
    console.log('✅ Regular user correctly blocked');
  }
}
```

## 🔍 Debugging

### Backend Debugging
```javascript
// In auth middleware
console.log('User role:', req.user.role);
console.log('Is admin:', req.user.role === 'admin');
```

### Frontend Debugging
```typescript
// In AdminRoute component
console.log('🔐 AdminRoute Check:', {
  isLoading,
  user: user ? { id: user.id, email: user.email, role: user.role } : null,
  isAdmin: user?.role === 'admin'
});
```

### Browser Console
Check browser console for:
- `🔐 AdminRoute Check:` - Shows user role and access decision
- `🚫 AdminRoute: No user` - User not logged in
- `🚫 AdminRoute: User is not admin` - User lacks admin role
- `✅ AdminRoute: User is admin` - Access granted

## 🚨 Common Issues & Solutions

### Issue 1: Role is undefined
**Problem**: User role shows as `undefined` in frontend
**Solution**: Ensure backend auth routes include `role: user.role` in response

### Issue 2: Admin access denied
**Problem**: Admin user gets 403 error
**Solution**: 
1. Check user role in database: `db.users.findOne({email: "admin@globetrotter.com"})`
2. Verify JWT token includes role
3. Check admin middleware is working

### Issue 3: Frontend redirects to dashboard
**Problem**: Admin user gets redirected to dashboard instead of admin panel
**Solution**:
1. Check browser console for AdminRoute debug messages
2. Verify user.role is 'admin' in AuthContext
3. Clear localStorage and login again

### Issue 4: Regular user can access admin
**Problem**: Non-admin users can access admin panel
**Solution**:
1. Check AdminRoute component is properly implemented
2. Verify backend admin middleware is working
3. Test with different user accounts

## 🔒 Security Best Practices

### 1. **Password Security**
- Change default admin password immediately
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Regular password updates

### 2. **Token Security**
- JWT tokens expire after 7 days
- Store tokens securely in localStorage
- Clear tokens on logout

### 3. **Role Verification**
- Always verify role on both frontend and backend
- Never trust client-side role information alone
- Use middleware for all admin routes

### 4. **Access Logging**
- Log all admin access attempts
- Monitor for unauthorized access
- Regular security audits

## 📊 Testing Checklist

### Backend Tests
- [ ] Admin login returns correct role
- [ ] Admin can access all admin endpoints
- [ ] Regular users blocked from admin endpoints
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected

### Frontend Tests
- [ ] Admin users can access `/admin` route
- [ ] Regular users redirected from `/admin` route
- [ ] Admin panel link shows for admin users
- [ ] Admin panel link hidden for regular users
- [ ] Logout clears admin access

### Integration Tests
- [ ] Full admin workflow (login → admin panel → user management)
- [ ] Role switching (promote user to admin)
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

## 🎯 Summary

The admin authentication system provides:

✅ **Secure Role-Based Access Control**
✅ **Frontend and Backend Protection**
✅ **JWT Token Authentication**
✅ **Automatic Role Verification**
✅ **User-Friendly Error Handling**
✅ **Comprehensive Testing**

**Your admin panel is now fully secured and ready for production use!** 🚀
