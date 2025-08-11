// Test script to simulate frontend login with admin credentials
const BASE_URL = 'http://localhost:4000';

async function testFrontendAdminLogin() {
  console.log('🧪 Testing Frontend Admin Login Process...\n');

  try {
    // Step 1: Simulate frontend login request
    console.log('1. Making login request (like frontend would)...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173' // Simulate frontend origin
      },
      body: JSON.stringify({
        email: 'admin@globetrotter.com',
        password: 'admin123456'
      })
    });

    console.log('Response status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('\n✅ Login successful!');
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      // Check if user data has the correct structure
      console.log('\n🔍 Checking user data structure:');
      console.log('- Has user object:', !!data.user);
      console.log('- Has token:', !!data.token);
      console.log('- User ID:', data.user?.id);
      console.log('- User name:', data.user?.name);
      console.log('- User email:', data.user?.email);
      console.log('- User role:', data.user?.role);
      console.log('- User emailVerified:', data.user?.emailVerified);
      
      // Check if this matches what frontend expects
      console.log('\n🎯 Frontend Compatibility Check:');
      const expectedFields = ['id', 'name', 'email', 'role', 'emailVerified'];
      const missingFields = expectedFields.filter(field => !(field in data.user));
      
      if (missingFields.length === 0) {
        console.log('✅ All expected fields are present');
      } else {
        console.log('❌ Missing fields:', missingFields);
      }
      
      // Check if role is admin
      if (data.user.role === 'admin') {
        console.log('✅ User has admin role - should be able to access admin panel');
      } else {
        console.log('❌ User does not have admin role');
      }
      
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed');
      console.log('Error response:', errorText);
    }

  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }

  // Step 2: Test if we can access admin endpoints with the token
  console.log('\n2. Testing admin access with token...');
  try {
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@globetrotter.com',
        password: 'admin123456'
      })
    });

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      const token = data.token;
      
      console.log('✅ Got token, testing admin access...');
      
      // Test admin stats endpoint
      const adminStatsResponse = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (adminStatsResponse.ok) {
        const statsData = await adminStatsResponse.json();
        console.log('✅ Admin access successful!');
        console.log('Stats data keys:', Object.keys(statsData));
      } else {
        console.log('❌ Admin access failed');
        console.log('Status:', adminStatsResponse.status);
        const errorText = await adminStatsResponse.text();
        console.log('Error:', errorText);
      }
    }
  } catch (error) {
    console.log('❌ Admin access test failed:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('- Check if login response contains all expected fields');
  console.log('- Verify user role is "admin"');
  console.log('- Confirm admin endpoints are accessible');
  console.log('- If all above work, issue is in frontend handling');
}

// Run the test
testFrontendAdminLogin();
