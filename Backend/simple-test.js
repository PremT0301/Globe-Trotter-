const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:4000/health');
    console.log('✅ Server is running:', response.data);
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
  }
}

testServer();
