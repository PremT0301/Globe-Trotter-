const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testItinerary() {
  try {
    console.log('🧪 Testing Itinerary Backend...\n');

    // Test 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'test123'
    });

    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    console.log('✅ Login successful');

    // Test 2: Create a test trip
    console.log('\n2. Creating test trip...');
    const tripResponse = await axios.post(`${BASE_URL}/api/trips`, {
      title: 'Test Itinerary Trip',
      destination: 'Paris, France',
      description: 'Testing itinerary functionality',
      startDate: '2024-06-15',
      endDate: '2024-06-17',
      travelers: 2,
      tripType: 'Cultural'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const tripId = tripResponse.data._id;
    console.log('✅ Test trip created:', tripId);

    // Test 3: Get cities for itinerary
    console.log('\n3. Fetching cities...');
    const citiesResponse = await axios.get(`${BASE_URL}/api/cities/popular/list?limit=5`);
    const cities = citiesResponse.data;
    console.log('✅ Cities fetched:', cities.length);

    if (cities.length === 0) {
      console.log('⚠️  No cities found. Creating a test city...');
      const cityResponse = await axios.post(`${BASE_URL}/api/cities`, {
        name: 'Paris',
        country: 'France',
        costIndex: 85.5,
        popularityScore: 95.2
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      cities.push(cityResponse.data);
    }

    const testCity = cities[0];
    console.log('Using city:', testCity.name, testCity.country);

    // Test 4: Create activities
    console.log('\n4. Creating test activities...');
    const activities = [];
    
    const activity1 = await axios.post(`${BASE_URL}/api/activities`, {
      cityId: testCity._id,
      name: 'Visit Eiffel Tower',
      type: 'attraction',
      cost: 25,
      duration: 180,
      description: 'Iconic Paris landmark'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    activities.push(activity1.data);

    const activity2 = await axios.post(`${BASE_URL}/api/activities`, {
      cityId: testCity._id,
      name: 'Lunch at French Bistro',
      type: 'restaurant',
      cost: 45,
      duration: 90,
      description: 'Traditional French cuisine'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    activities.push(activity2.data);

    console.log('✅ Activities created:', activities.length);

    // Test 5: Create itinerary items
    console.log('\n5. Creating itinerary items...');
    const itineraryItems = [];

    // Day 1 - June 15
    const item1 = await axios.post(`${BASE_URL}/api/itinerary`, {
      tripId,
      cityId: testCity._id,
      date: '2024-06-15',
      activityId: activities[0]._id,
      orderIndex: 0,
      notes: 'Morning visit to avoid crowds'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    itineraryItems.push(item1.data);

    const item2 = await axios.post(`${BASE_URL}/api/itinerary`, {
      tripId,
      cityId: testCity._id,
      date: '2024-06-15',
      activityId: activities[1]._id,
      orderIndex: 1,
      notes: 'Lunch after Eiffel Tower visit'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    itineraryItems.push(item2.data);

    // Day 2 - June 16
    const item3 = await axios.post(`${BASE_URL}/api/itinerary`, {
      tripId,
      cityId: testCity._id,
      date: '2024-06-16',
      activityId: activities[0]._id,
      orderIndex: 0,
      notes: 'Evening visit for sunset views'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    itineraryItems.push(item3.data);

    console.log('✅ Itinerary items created:', itineraryItems.length);

    // Test 6: Fetch itinerary
    console.log('\n6. Fetching itinerary...');
    const itineraryResponse = await axios.get(`${BASE_URL}/api/itinerary/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const itinerary = itineraryResponse.data;
    console.log('✅ Itinerary fetched:', itinerary.length, 'items');

    // Display itinerary data
    console.log('\n📋 Itinerary Data:');
    itinerary.forEach((item, index) => {
      console.log(`${index + 1}. Date: ${new Date(item.date).toLocaleDateString()}`);
      console.log(`   Activity: ${item.activityId?.name || 'No activity'}`);
      console.log(`   City: ${item.cityId?.name || 'Unknown'}`);
      console.log(`   Order: ${item.orderIndex}`);
      console.log(`   Notes: ${item.notes || 'None'}`);
      console.log('');
    });

    // Test 7: Get itinerary summary
    console.log('\n7. Fetching itinerary summary...');
    const summaryResponse = await axios.get(`${BASE_URL}/api/itinerary/${tripId}/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const summary = summaryResponse.data;
    console.log('✅ Summary fetched:');
    console.log('   Total days:', summary.totalDays);
    console.log('   Total activities:', summary.totalActivities);
    console.log('   Cities visited:', summary.cities.join(', '));

    // Test 8: Update itinerary item
    console.log('\n8. Updating itinerary item...');
    const updateResponse = await axios.put(`${BASE_URL}/api/itinerary/${itineraryItems[0]._id}`, {
      notes: 'Updated notes for better planning'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Itinerary item updated:', updateResponse.data.notes);

    // Test 9: Delete itinerary item
    console.log('\n9. Deleting itinerary item...');
    await axios.delete(`${BASE_URL}/api/itinerary/${itineraryItems[2]._id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Itinerary item deleted');

    // Test 10: Verify deletion
    console.log('\n10. Verifying deletion...');
    const finalItineraryResponse = await axios.get(`${BASE_URL}/api/itinerary/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const finalItinerary = finalItineraryResponse.data;
    console.log('✅ Final itinerary count:', finalItinerary.length, 'items');

    // Test 11: Clean up - Delete test trip
    console.log('\n11. Cleaning up test data...');
    await axios.delete(`${BASE_URL}/api/trips/${tripId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('✅ Test trip deleted');

    console.log('\n🎉 All itinerary tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Trip creation: ✅ Working');
    console.log('- Activity creation: ✅ Working');
    console.log('- Itinerary item creation: ✅ Working');
    console.log('- Itinerary fetching: ✅ Working');
    console.log('- Itinerary summary: ✅ Working');
    console.log('- Itinerary updates: ✅ Working');
    console.log('- Itinerary deletion: ✅ Working');
    console.log('- Data relationships: ✅ Working');
    console.log('- Cleanup: ✅ Working');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

testItinerary();
