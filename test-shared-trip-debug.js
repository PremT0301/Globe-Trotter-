const fetch = require('node-fetch');

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...');
  
  try {
    const response = await fetch('http://localhost:4000/health');
    console.log('✅ Backend health check status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend health data:', data);
      return true;
    } else {
      console.log('❌ Backend health check failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
}

async function testSharedTripEndpoint(slug) {
  console.log(`🔍 Testing shared trip endpoint with slug: ${slug}`);
  
  try {
    const response = await fetch(`http://localhost:4000/api/shared/u/${slug}`);
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Shared trip data:', JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function testSharedTripsList() {
  console.log('🔍 Testing shared trips list...');
  
  try {
    const response = await fetch('http://localhost:4000/api/shared/explore?limit=5');
    console.log('📡 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Shared trips list:', JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting shared trip debugging...\n');
  
  // Test 1: Backend connection
  const backendConnected = await testBackendConnection();
  if (!backendConnected) {
    console.log('❌ Backend is not accessible. Please make sure it\'s running on port 4000.');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: List all shared trips
  const sharedTrips = await testSharedTripsList();
  if (sharedTrips && sharedTrips.sharedTrips && sharedTrips.sharedTrips.length > 0) {
    console.log(`✅ Found ${sharedTrips.sharedTrips.length} shared trips`);
    
    // Test 3: Test the first shared trip
    const firstTrip = sharedTrips.sharedTrips[0];
    if (firstTrip && firstTrip.publicUrl) {
      console.log(`\n🔍 Testing first shared trip: ${firstTrip.publicUrl}`);
      await testSharedTripEndpoint(firstTrip.publicUrl);
    }
  } else {
    console.log('⚠️ No shared trips found in the database');
    console.log('💡 You need to create and share a trip first');
  }
  
  // Test 4: Test with the specific slug from the error
  console.log('\n' + '='.repeat(50) + '\n');
  console.log('🔍 Testing with the specific slug from the error...');
  await testSharedTripEndpoint('689a9f729a10a525396231f4');
}

main().catch(console.error);
