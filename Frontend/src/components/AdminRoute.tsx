import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // Debug logging
  console.log('🔐 AdminRoute Check:', {
    isLoading,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    isAdmin: user?.role === 'admin'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    console.log('🚫 AdminRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    console.log('🚫 AdminRoute: User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ AdminRoute: User is admin, allowing access');
  return <>{children}</>;
};

export default AdminRoute;
