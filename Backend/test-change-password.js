const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testChangePassword() {
  try {
    console.log('🧪 Testing Change Password Endpoint...\n');

    // Step 1: Login to get a token
    console.log('1. Logging in to get authentication token...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token\n');

    // Step 2: Test change password
    console.log('2. Testing change password...');
    const changePasswordResponse = await axios.post(
      `${BASE_URL}/api/auth/change-password`,
      {
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Change password successful!');
    console.log('Response:', changePasswordResponse.data);

    // Step 3: Verify new password works
    console.log('\n3. Verifying new password works...');
    const newLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'newpassword123'
    });

    console.log('✅ New password login successful!');
    console.log('New token:', newLoginResponse.data.token ? 'Received' : 'None');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testChangePassword();
