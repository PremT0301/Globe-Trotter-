const BASE_URL = 'http://localhost:4000';

async function testChangePassword() {
  try {
    console.log('🧪 Testing Change Password...\n');

    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // Step 2: Change password
    console.log('2. Changing password...');
    const changeResponse = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword: 'password123',
        newPassword: 'newpassword123'
      })
    });

    if (!changeResponse.ok) {
      const errorData = await changeResponse.text();
      throw new Error(`Change password failed: ${changeResponse.status} - ${errorData}`);
    }

    const changeData = await changeResponse.json();
    console.log('✅ Password changed successfully!');
    console.log('Response:', changeData);

    // Step 3: Test new password
    console.log('\n3. Testing new password...');
    const newLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'newpassword123'
      })
    });

    if (!newLoginResponse.ok) {
      throw new Error(`New password login failed: ${newLoginResponse.status}`);
    }

    const newLoginData = await newLoginResponse.json();
    console.log('✅ New password works!');
    console.log('New token received:', !!newLoginData.token);

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error:', error.message);
  }
}

testChangePassword();
