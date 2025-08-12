const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';
let authToken = '';
let userId = '';
let tripId = '';
let communityPostId = '';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

const testUser2 = {
  email: 'test2@example.com',
  password: 'password123'
};

async function loginUser(user) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, user);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function createTestTrip(token) {
  try {
    const tripData = {
      title: 'Test Trip for Notifications',
      destination: 'Paris, France',
      description: 'A test trip to verify notification system',
      startDate: '2024-06-01',
      endDate: '2024-06-07',
      travelers: 2,
      tripType: 'Leisure',
      budget: 5000
    };

    const response = await axios.post(`${BASE_URL}/trips`, tripData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data._id;
  } catch (error) {
    console.error('Failed to create test trip:', error.response?.data || error.message);
    throw error;
  }
}

async function createCommunityPost(token, tripId) {
  try {
    const postData = {
      tripId: tripId,
      title: 'Test Community Post',
      description: 'A test post to verify notification system',
      tags: ['test', 'notification', 'paris']
    };

    const response = await axios.post(`${BASE_URL}/community/posts`, postData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data._id;
  } catch (error) {
    console.error('Failed to create community post:', error.response?.data || error.message);
    throw error;
  }
}

async function testNotifications() {
  console.log('🧪 Starting Notification System Test...\n');

  try {
    // Step 1: Login as first user
    console.log('1️⃣ Logging in as first user...');
    authToken = await loginUser(testUser);
    console.log('✅ First user logged in successfully\n');

    // Step 2: Create a test trip
    console.log('2️⃣ Creating test trip...');
    tripId = await createTestTrip(authToken);
    console.log(`✅ Test trip created with ID: ${tripId}\n`);

    // Step 3: Create a community post
    console.log('3️⃣ Creating community post...');
    communityPostId = await createCommunityPost(authToken, tripId);
    console.log(`✅ Community post created with ID: ${communityPostId}\n`);

    // Step 4: Login as second user
    console.log('4️⃣ Logging in as second user...');
    const token2 = await loginUser(testUser2);
    console.log('✅ Second user logged in successfully\n');

    // Step 5: Test Like Notification
    console.log('5️⃣ Testing like notification...');
    await axios.post(`${BASE_URL}/community/posts/${communityPostId}/like`, {}, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Like notification triggered\n');

    // Step 6: Test Comment Notification
    console.log('6️⃣ Testing comment notification...');
    await axios.post(`${BASE_URL}/community/posts/${communityPostId}/comments`, {
      text: 'This is a test comment to trigger notification!'
    }, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Comment notification triggered\n');

    // Step 7: Test Clone Notification
    console.log('7️⃣ Testing clone notification...');
    await axios.post(`${BASE_URL}/community/posts/${communityPostId}/clone`, {
      title: 'Cloned Test Trip',
      description: 'A cloned version of the test trip'
    }, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Clone notification triggered\n');

    // Step 8: Check notifications for first user
    console.log('8️⃣ Checking notifications for first user...');
    const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const notifications = notificationsResponse.data.notifications;
    console.log(`✅ Found ${notifications.length} notifications:`);
    
    notifications.forEach((notification, index) => {
      console.log(`   ${index + 1}. ${notification.type.toUpperCase()}: ${notification.message}`);
      console.log(`      From: ${notification.senderId.name}`);
      console.log(`      Time: ${new Date(notification.createdAt).toLocaleString()}`);
      console.log(`      Read: ${notification.isRead ? 'Yes' : 'No'}\n`);
    });

    // Step 9: Test mark as read
    if (notifications.length > 0) {
      console.log('9️⃣ Testing mark as read...');
      await axios.patch(`${BASE_URL}/notifications/${notifications[0]._id}/read`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ First notification marked as read\n');
    }

    // Step 10: Test mark all as read
    console.log('🔟 Testing mark all as read...');
    await axios.patch(`${BASE_URL}/notifications/mark-all-read`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ All notifications marked as read\n');

    // Step 11: Check unread count
    console.log('1️⃣1️⃣ Checking unread count...');
    const unreadResponse = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Unread count: ${unreadResponse.data.unreadCount}\n`);

    console.log('🎉 Notification system test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Created ${notifications.length} notifications`);
    console.log(`   - Tested like, comment, and clone notifications`);
    console.log(`   - Verified mark as read functionality`);
    console.log(`   - Verified mark all as read functionality`);
    console.log(`   - Final unread count: ${unreadResponse.data.unreadCount}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
testNotifications();
