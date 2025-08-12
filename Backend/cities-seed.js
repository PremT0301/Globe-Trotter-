require('dotenv').config();
const mongoose = require('mongoose');
const City = require('./src/models/City');

async function seedCities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing cities
    console.log('🧹 Clearing existing cities...');
    await City.deleteMany({});

    // Create comprehensive list of cities with images
    console.log('🏙️ Creating cities with images...');
    const cities = await City.create([
      {
        name: 'Paris',
        country: 'France',
        costIndex: 85.5,
        popularityScore: 95.2,
        image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        costIndex: 78.3,
        popularityScore: 92.1,
        image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'New York',
        country: 'USA',
        costIndex: 88.7,
        popularityScore: 89.5,
        image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'London',
        country: 'UK',
        costIndex: 82.1,
        popularityScore: 87.3,
        image: 'https://images.pexels.com/photos/372098/pexels-photo-372098.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        costIndex: 65.4,
        popularityScore: 84.2,
        image: 'https://images.pexels.com/photos/13861/IMG_3497bfree.jpg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Rome',
        country: 'Italy',
        costIndex: 72.8,
        popularityScore: 86.7,
        image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Amsterdam',
        country: 'Netherlands',
        costIndex: 75.9,
        popularityScore: 81.4,
        image: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Berlin',
        country: 'Germany',
        costIndex: 68.2,
        popularityScore: 79.8,
        image: 'https://images.pexels.com/photos/1835718/pexels-photo-1835718.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        costIndex: 45.6,
        popularityScore: 76.3,
        image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Santorini',
        country: 'Greece',
        costIndex: 58.9,
        popularityScore: 88.1,
        image: 'https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Dubai',
        country: 'UAE',
        costIndex: 76.4,
        popularityScore: 82.5,
        image: 'https://images.pexels.com/photos/1518790/pexels-photo-1518790.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Singapore',
        country: 'Singapore',
        costIndex: 79.2,
        popularityScore: 85.7,
        image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Hong Kong',
        country: 'China',
        costIndex: 81.3,
        popularityScore: 83.9,
        image: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Bangkok',
        country: 'Thailand',
        costIndex: 52.7,
        popularityScore: 78.4,
        image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Seoul',
        country: 'South Korea',
        costIndex: 74.1,
        popularityScore: 80.2,
        image: 'https://images.pexels.com/photos/237211/pexels-photo-237211.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Sydney',
        country: 'Australia',
        costIndex: 83.6,
        popularityScore: 81.8,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Melbourne',
        country: 'Australia',
        costIndex: 80.9,
        popularityScore: 77.5,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Vancouver',
        country: 'Canada',
        costIndex: 77.3,
        popularityScore: 79.1,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Toronto',
        country: 'Canada',
        costIndex: 75.8,
        popularityScore: 76.7,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Los Angeles',
        country: 'USA',
        costIndex: 85.2,
        popularityScore: 84.3,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'San Francisco',
        country: 'USA',
        costIndex: 89.1,
        popularityScore: 82.6,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Miami',
        country: 'USA',
        costIndex: 78.4,
        popularityScore: 75.9,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Chicago',
        country: 'USA',
        costIndex: 76.9,
        popularityScore: 74.2,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Madrid',
        country: 'Spain',
        costIndex: 67.8,
        popularityScore: 78.5,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Florence',
        country: 'Italy',
        costIndex: 70.3,
        popularityScore: 82.1,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Venice',
        country: 'Italy',
        costIndex: 73.5,
        popularityScore: 85.4,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Prague',
        country: 'Czech Republic',
        costIndex: 58.7,
        popularityScore: 79.3,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Vienna',
        country: 'Austria',
        costIndex: 71.2,
        popularityScore: 77.8,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Budapest',
        country: 'Hungary',
        costIndex: 54.6,
        popularityScore: 76.9,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Krakow',
        country: 'Poland',
        costIndex: 48.9,
        popularityScore: 74.1,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Istanbul',
        country: 'Turkey',
        costIndex: 56.3,
        popularityScore: 78.7,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Cairo',
        country: 'Egypt',
        costIndex: 42.8,
        popularityScore: 72.5,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Marrakech',
        country: 'Morocco',
        costIndex: 44.7,
        popularityScore: 75.3,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Cape Town',
        country: 'South Africa',
        costIndex: 51.2,
        popularityScore: 73.8,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Rio de Janeiro',
        country: 'Brazil',
        costIndex: 55.9,
        popularityScore: 76.2,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Buenos Aires',
        country: 'Argentina',
        costIndex: 49.3,
        popularityScore: 71.4,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Mexico City',
        country: 'Mexico',
        costIndex: 48.7,
        popularityScore: 74.6,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Lima',
        country: 'Peru',
        costIndex: 45.1,
        popularityScore: 69.8,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      },
      {
        name: 'Santiago',
        country: 'Chile',
        costIndex: 52.4,
        popularityScore: 68.9,
        image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1'
      }
    ]);

    console.log('✅ Cities seeded successfully!');
    console.log(`📊 Created ${cities.length} cities with images`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding cities:', error);
    process.exit(1);
  }
}

seedCities();
