const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testLoginIssue() {
  try {
    console.log('🔍 Testing Login Issue...\n');

    // Test 1: Check if server is running
    console.log('1. Checking if server is running...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: { 'Authorization': 'Bearer test' }
      });
      console.log('❌ Server is running but should reject invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Server is running and responding');
      } else {
        console.log('❌ Server might not be running or has issues');
        return;
      }
    }

    // Test 2: Try admin login
    console.log('\n2. Testing admin login...');
    try {
      const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@globetrotter.com',
        password: 'admin123456'
      });
      
      console.log('✅ Admin login successful!');
      console.log('User role:', adminLoginResponse.data.user.role);
      console.log('User email:', adminLoginResponse.data.user.email);
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Try regular user login
    console.log('\n3. Testing regular user login...');
    try {
      const userLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'testuser@example.com',
        password: 'password123'
      });
      
      console.log('✅ Regular user login successful!');
      console.log('User role:', userLoginResponse.data.user.role);
      console.log('User email:', userLoginResponse.data.user.email);
    } catch (error) {
      console.log('❌ Regular user login failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Try with wrong password
    console.log('\n4. Testing wrong password...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'admin@globetrotter.com',
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed with wrong password');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected wrong password');
      } else {
        console.log('❌ Unexpected error with wrong password:', error.response?.data?.message);
      }
    }

    // Test 5: Try with non-existent email
    console.log('\n5. Testing non-existent email...');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'password123'
      });
      console.log('❌ Should have failed with non-existent email');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected non-existent email');
      } else {
        console.log('❌ Unexpected error with non-existent email:', error.response?.data?.message);
      }
    }

    // Test 6: Check if admin user exists in database
    console.log('\n6. Checking admin user in database...');
    try {
      const adminCheckResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: 'Admin Check',
        email: 'admin@globetrotter.com',
        password: 'admin123456'
      });
      console.log('❌ Admin user already exists (this is expected)');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Admin user exists in database');
      } else {
        console.log('❌ Unexpected error checking admin user:', error.response?.data?.message);
      }
    }

    console.log('\n📋 Summary:');
    console.log('- Server status: Check above');
    console.log('- Admin login: Check above');
    console.log('- Regular user login: Check above');
    console.log('- Error handling: Check above');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running: npm run dev');
    }
  }
}

testLoginIssue();
