import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminLoginTest: React.FC = () => {
  const [email, setEmail] = useState('admin@globetrotter.com');
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const [loginResult, setLoginResult] = useState<any>(null);
  
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const handleTestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginResult(null);
    
    try {
      console.log('🧪 Testing admin login with:', { email, password: '***' });
      
      await login(email, password);
      
      console.log('✅ Login completed in test page');
      setLoginResult({
        success: true,
        message: 'Login successful!',
        user: user
      });
      
      showToast('success', 'Test Login Successful', 'Admin login worked correctly!');
      
    } catch (error) {
      console.log('❌ Login failed in test page:', error);
      setLoginResult({
        success: false,
        message: 'Login failed',
        error: error
      });
      
      showToast('error', 'Test Login Failed', 'Admin login failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // This will be handled by the navbar logout button
    console.log('Logout requested');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">🧪 Admin Login Test</h2>
          <p className="mt-2 text-gray-600">Test admin login functionality</p>
        </div>

        {/* Current User Status */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Current User Status</h3>
          {user ? (
            <div className="space-y-2">
              <p><strong>Logged in:</strong> Yes</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> <span className={`px-2 py-1 rounded text-sm ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{user.role || 'undefined'}</span></p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              
              {user.role === 'admin' ? (
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-semibold">✅ Admin Access Granted!</p>
                  <p className="text-green-700 text-sm">You should see the Admin Panel link in the navbar</p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 font-semibold">⚠️ Regular User</p>
                  <p className="text-yellow-700 text-sm">Admin Panel link will not be visible</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              <p>No user logged in</p>
            </div>
          )}
        </div>

        {/* Test Login Form */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Test Admin Login</h3>
          <form onSubmit={handleTestLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@globetrotter.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin123456"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Test Login'}
            </button>
          </form>
        </div>

        {/* Login Result */}
        {loginResult && (
          <div className={`p-4 rounded-lg ${loginResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h4 className={`font-semibold ${loginResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {loginResult.success ? '✅ Success' : '❌ Failed'}
            </h4>
            <p className={loginResult.success ? 'text-green-700' : 'text-red-700'}>
              {loginResult.message}
            </p>
            {loginResult.user && (
              <div className="mt-2 text-sm">
                <p><strong>Role:</strong> {loginResult.user.role}</p>
                <p><strong>Email:</strong> {loginResult.user.email}</p>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Use the credentials: admin@globetrotter.com / admin123456</li>
            <li>Click "Test Login" to verify admin login works</li>
            <li>Check if "Admin Panel" link appears in navbar</li>
            <li>Look at browser console for debug messages</li>
            <li>If successful, navigate to Admin Panel</li>
          </ol>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Debug Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Backend URL:</strong> http://localhost:4000</p>
            <p><strong>Frontend URL:</strong> http://localhost:5173</p>
            <p><strong>Admin User:</strong> admin@globetrotter.com</p>
            <p><strong>Expected Role:</strong> admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginTest;
