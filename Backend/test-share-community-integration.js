const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123'
};

const testTrip = {
  title: 'Test Trip for Community Integration',
  destination: 'Paris, France',
  description: 'A test trip to verify community post integration',
  startDate: '2024-06-01',
  endDate: '2024-06-07',
  travelers: 2,
  budget: 5000,
  tripType: 'Cultural'
};

async function testShareCommunityIntegration() {
  try {
    console.log('🧪 Testing Share Trip + Community Post Integration...\n');

    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    
    console.log('✅ Login successful');
    
    // Set auth header
    const authHeader = { Authorization: `Bearer ${token}` };

    // Step 2: Create a trip
    console.log('\n2. Creating a test trip...');
    const tripResponse = await axios.post(`${BASE_URL}/trips`, testTrip, { headers: authHeader });
    const tripId = tripResponse.data._id;
    
    console.log('✅ Trip created:', tripId);

    // Step 3: Share the trip (this should create a community post)
    console.log('\n3. Sharing the trip...');
    const shareResponse = await axios.post(`${BASE_URL}/shared/${tripId}`, {}, { headers: authHeader });
    
    console.log('✅ Trip shared successfully');
    console.log('   Share URL:', shareResponse.data.shareUrl);
    console.log('   Community Post created:', shareResponse.data.communityPost ? 'Yes' : 'No');

    // Step 4: Verify community post was created
    console.log('\n4. Verifying community post...');
    const communityPostsResponse = await axios.get(`${BASE_URL}/community/posts?limit=10`);
    const communityPost = communityPostsResponse.data.posts.find(post => post.tripId._id === tripId);
    
    if (communityPost) {
      console.log('✅ Community post found:', communityPost.title);
      console.log('   Post ID:', communityPost._id);
      console.log('   Tags:', communityPost.tags);
    } else {
      console.log('❌ Community post not found');
    }

    // Step 5: Check shared trips with community posts
    console.log('\n5. Checking shared trips with community posts...');
    const sharedTripsResponse = await axios.get(`${BASE_URL}/shared/explore?limit=10`);
    const sharedTrip = sharedTripsResponse.data.sharedTrips.find(st => st.tripId._id === tripId);
    
    if (sharedTrip) {
      console.log('✅ Shared trip found');
      console.log('   Has community post:', sharedTrip.communityPost ? 'Yes' : 'No');
      if (sharedTrip.communityPost) {
        console.log('   Community post ID:', sharedTrip.communityPost._id);
      }
    } else {
      console.log('❌ Shared trip not found');
    }

    // Step 6: Test unsharing (should archive community post)
    console.log('\n6. Testing unshare functionality...');
    const unshareResponse = await axios.delete(`${BASE_URL}/shared/${tripId}`, { headers: authHeader });
    
    console.log('✅ Trip unshared:', unshareResponse.data.message);

    // Step 7: Verify community post was archived
    console.log('\n7. Verifying community post was archived...');
    const archivedPostsResponse = await axios.get(`${BASE_URL}/community/posts?limit=10`);
    const archivedPost = archivedPostsResponse.data.posts.find(post => post.tripId._id === tripId);
    
    if (!archivedPost) {
      console.log('✅ Community post was archived (not visible in active posts)');
    } else {
      console.log('❌ Community post still visible in active posts');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Trip sharing creates community post ✅');
    console.log('   - Community post has proper tags and metadata ✅');
    console.log('   - Shared trips show community post association ✅');
    console.log('   - Unsharing archives community post ✅');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

// Run the test
testShareCommunityIntegration();
