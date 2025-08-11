# 🛡️ Admin Panel Setup & Documentation

## 📋 Overview

The GlobeTrotter admin panel provides comprehensive management capabilities for platform administrators. This document covers setup, authentication, and all available features.

## 🔐 Admin Credentials

### Default Admin Account
- **Email**: `admin@globetrotter.com`
- **Password**: `admin123456`
- **Role**: `admin`

### ⚠️ Security Notice
**IMPORTANT**: Change the default password immediately after first login!

## 🚀 Setup Instructions

### 1. Create Admin User
Run the admin setup script:
```bash
cd Backend
node setup-admin.js
```

This script will:
- ✅ Create admin user if it doesn't exist
- ✅ Set proper admin role
- ✅ Enable email verification bypass for admin
- ✅ Display admin credentials

### 2. Start Backend Server
```bash
cd Backend
npm run dev
```

### 3. Access Admin Panel
1. Login with admin credentials at `/login`
2. Navigate to `/admin` or use "Admin Panel" in user menu
3. Only users with `role: 'admin'` can access

## 🎯 Admin Features

### 📊 Overview Dashboard
- **Real-time Statistics**: Total users, trips, active trips, completed trips
- **User Growth Chart**: Monthly user registration trends
- **Top Destinations**: Most popular travel destinations
- **Platform Metrics**: Key performance indicators

### 👥 User Management
- **View All Users**: Paginated list with search and filtering
- **User Details**: Complete user information and trip history
- **Role Management**: Promote/demote users to admin role
- **User Deletion**: Remove users (with confirmation)
- **Email Verification Status**: Track verified vs unverified users

### 🗺️ Trip Management
- **View All Trips**: Complete trip database with search
- **Trip Details**: Full trip information with user data
- **Status Management**: Update trip status (planning/active/completed/cancelled)
- **Trip Deletion**: Remove trips (with confirmation)
- **User Association**: See which user created each trip

### 📈 Analytics
- **User Registration Trends**: Daily/monthly user growth
- **Trip Creation Analytics**: Trip creation patterns
- **Status Distribution**: Trip status breakdown
- **Destination Analytics**: Popular destinations analysis

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile

### Admin Statistics
- `GET /api/admin/stats` - Dashboard overview data
- `GET /api/admin/analytics` - Detailed analytics

### User Management
- `GET /api/admin/users` - List users (with pagination/search)
- `GET /api/admin/users/:userId` - Get user details
- `PATCH /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user

### Trip Management
- `GET /api/admin/trips` - List trips (with pagination/search)
- `GET /api/admin/trips/:tripId` - Get trip details
- `PATCH /api/admin/trips/:tripId/status` - Update trip status
- `DELETE /api/admin/trips/:tripId` - Delete trip

## 🛡️ Security Features

### Role-Based Access Control
- **Admin Role**: Full access to all admin features
- **User Role**: No access to admin panel
- **Route Protection**: Frontend and backend protection

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Role Verification**: Backend middleware checks admin role
- **Session Management**: Automatic token refresh

### Data Protection
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

## 🎨 Frontend Features

### Responsive Design
- **Mobile-First**: Works on all device sizes
- **Modern UI**: Clean, professional interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

### Interactive Elements
- **Real-time Search**: Instant search across users/trips
- **Sorting**: Multiple sort options
- **Pagination**: Efficient data loading
- **Confirmation Dialogs**: Safe deletion with confirmations

### Navigation
- **Tab-based Interface**: Easy navigation between sections
- **Breadcrumbs**: Clear navigation path
- **Admin Badge**: Visual admin identification

## 🔄 Data Flow

### User Management Flow
1. **List Users** → Fetch paginated user list
2. **Search/Filter** → Real-time search and filtering
3. **View Details** → Get complete user information
4. **Update Role** → Change user role (user ↔ admin)
5. **Delete User** → Remove user with confirmation

### Trip Management Flow
1. **List Trips** → Fetch paginated trip list
2. **Search/Filter** → Search by title/destination
3. **View Details** → Get complete trip information
4. **Update Status** → Change trip status
5. **Delete Trip** → Remove trip with confirmation

## 🚨 Error Handling

### Common Errors
- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Non-admin user access attempt
- **404 Not Found**: User/trip not found
- **500 Server Error**: Database or server issues

### Error Recovery
- **Automatic Retry**: Failed requests retry automatically
- **User Feedback**: Clear error messages
- **Graceful Degradation**: Partial functionality if some features fail

## 📱 Mobile Support

### Responsive Features
- **Touch-Friendly**: Large touch targets
- **Swipe Navigation**: Mobile-optimized navigation
- **Optimized Tables**: Scrollable tables for mobile
- **Mobile Menus**: Collapsible navigation

## 🔧 Configuration

### Environment Variables
```env
# Required for admin functionality
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Schema
```javascript
// User Model with Admin Role
{
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  emailVerified: Boolean,
  profilePhoto: String,
  // ... other fields
}
```

## 🚀 Deployment

### Production Checklist
- [ ] Change default admin password
- [ ] Set secure JWT secret
- [ ] Configure HTTPS
- [ ] Set up monitoring
- [ ] Backup database
- [ ] Test all admin functions

### Security Best Practices
- [ ] Regular password updates
- [ ] Monitor admin access logs
- [ ] Limit admin user count
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📞 Support

### Troubleshooting
1. **Can't Access Admin Panel**: Check user role is 'admin'
2. **Login Issues**: Verify credentials and JWT secret
3. **Data Not Loading**: Check database connection
4. **Permission Errors**: Verify admin middleware

### Getting Help
- Check server logs for detailed error messages
- Verify all environment variables are set
- Ensure database is running and accessible
- Test with default admin credentials first

---

**🎉 Your admin panel is now ready for production use!**
