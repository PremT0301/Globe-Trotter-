// Debug script to test login functionality
const BASE_URL = 'http://localhost:4000';

async function debugLogin() {
  console.log('🔍 Debugging Login Issue...\n');

  // Test 1: Check if we can reach the backend
  console.log('1. Testing backend connectivity...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Backend is reachable');
    } else {
      console.log('❌ Backend responded with error:', response.status);
    }
  } catch (error) {
    console.log('❌ Cannot reach backend:', error.message);
    console.log('💡 Make sure backend server is running: npm run dev (in Backend folder)');
    return;
  }

  // Test 2: Test login with admin credentials
  console.log('\n2. Testing admin login...');
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

    console.log('Response status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));

    if (loginResponse.ok) {
      const data = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('User data:', data.user);
      console.log('Token received:', !!data.token);
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login failed');
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }

  // Test 3: Test with wrong credentials
  console.log('\n3. Testing wrong credentials...');
  try {
    const wrongLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@globetrotter.com',
        password: 'wrongpassword'
      })
    });

    console.log('Wrong credentials response status:', wrongLoginResponse.status);
    
    if (wrongLoginResponse.status === 401) {
      const errorText = await wrongLoginResponse.text();
      console.log('✅ Correctly rejected wrong password');
      console.log('Error message:', errorText);
    } else {
      console.log('❌ Unexpected response for wrong credentials');
    }
  } catch (error) {
    console.log('❌ Wrong credentials test failed:', error.message);
  }

  // Test 4: Check CORS
  console.log('\n4. Testing CORS...');
  try {
    const corsResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', Object.fromEntries(corsResponse.headers.entries()));
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }

  console.log('\n📋 Debug Summary:');
  console.log('- Check the above results to identify the issue');
  console.log('- If backend is not reachable, start it with: cd Backend && npm run dev');
  console.log('- If CORS issues, check backend CORS configuration');
  console.log('- If login fails, check database connection and user credentials');
}

// Run the debug function
debugLogin();
