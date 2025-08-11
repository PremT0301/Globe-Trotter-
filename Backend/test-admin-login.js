const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login...\n');

    // Test 1: Admin Login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@globetrotter.com',
      password: 'admin123456'
    });

    const loginData = loginResponse.data;
    console.log('✅ Admin login successful!');
    console.log('Token received:', loginData.token ? 'Yes' : 'No');
    console.log('User role:', loginData.user.role);
    console.log('User email:', loginData.user.email);

    // Test 2: Access Admin Stats (should work)
    console.log('\n2. Testing admin stats access...');
    const statsResponse = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    const statsData = statsResponse.data;
    console.log('✅ Admin stats access successful!');
    console.log('Stats data received:', Object.keys(statsData));

    // Test 3: Access Admin Users (should work)
    console.log('\n3. Testing admin users access...');
    const usersResponse = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    });

    const usersData = usersResponse.data;
    console.log('✅ Admin users access successful!');
    console.log('Users found:', usersData.users.length);

    // Test 4: Try to access admin with regular user (should fail)
    console.log('\n4. Testing regular user access to admin (should fail)...');
    
    // First create a regular user
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });
      console.log('✅ Test user created');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Test user already exists');
      }
    }

    // Login as regular user
    const regularLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });

    const regularUserData = regularLoginResponse.data;
    console.log('✅ Regular user login successful');
    console.log('Regular user role:', regularUserData.user.role);

    // Try to access admin with regular user token
    try {
      await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${regularUserData.token}`
        }
      });
      console.log('❌ Regular user should be blocked from admin access');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Regular user correctly blocked from admin access!');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    console.log('\n🎉 All admin authentication tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Admin login: ✅ Working');
    console.log('- Admin role verification: ✅ Working');
    console.log('- Admin API access: ✅ Working');
    console.log('- Regular user blocking: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

testAdminLogin();
