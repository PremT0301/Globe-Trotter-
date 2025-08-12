require('dotenv').config();
const mongoose = require('mongoose');
const CommunityPost = require('./src/models/CommunityPost');
const Trip = require('./src/models/Trip');
const User = require('./src/models/User');

async function seedCommunityPosts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get some existing users and trips for seeding
    const users = await User.find().limit(5);
    const trips = await Trip.find().limit(10);

    if (users.length === 0 || trips.length === 0) {
      console.log('❌ Need users and trips to create community posts');
      console.log('Please run seed-data.js first to create users and trips');
      process.exit(1);
    }

    console.log('🧹 Clearing existing community posts...');
    await CommunityPost.deleteMany({});

    console.log('📝 Creating demo community posts...');

    const demoPosts = [
      {
        userId: users[0]._id,
        tripId: trips[0]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Amazing Adventure in Bali! 🌴",
        description: "Just returned from an incredible 10-day adventure in Bali. From sunrise hikes at Mount Batur to exploring hidden waterfalls, this trip was absolutely magical. The local culture, delicious food, and stunning landscapes made it an unforgettable experience. Highly recommend visiting the rice terraces in Tegalalang and the sacred monkey forest!",
        coverImage: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["bali", "adventure", "indonesia", "hiking", "culture"],
        likes: [users[1]?._id, users[2]?._id, users[3]?._id],
        comments: [
          { userId: users[1]?._id, text: "This looks incredible! How was the weather?", createdAt: new Date(Date.now() - 86400000) },
          { userId: users[2]?._id, text: "I'm planning a similar trip next month. Any tips for the Mount Batur hike?", createdAt: new Date(Date.now() - 43200000) }
        ],
        clones: [{ userId: users[3]?._id, clonedAt: new Date(Date.now() - 172800000) }],
        views: 156,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[1]?._id || users[0]._id,
        tripId: trips[1]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Romantic Getaway in Paris 💕",
        description: "Spent a perfect week in the City of Love with my partner. The Eiffel Tower at sunset, romantic walks along the Seine, and amazing French cuisine. Don't miss the Louvre and the charming Montmartre neighborhood. The best part was our picnic in Luxembourg Gardens!",
        coverImage: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["paris", "romantic", "france", "couples", "culture"],
        likes: [users[0]?._id, users[2]?._id, users[3]?._id, users[4]?._id],
        comments: [
          { userId: users[0]?._id, text: "Paris is always a good idea! 😍", createdAt: new Date(Date.now() - 7200000) },
          { userId: users[3]?._id, text: "Which restaurants would you recommend?", createdAt: new Date(Date.now() - 3600000) }
        ],
        clones: [
          { userId: users[2]?._id, clonedAt: new Date(Date.now() - 86400000) },
          { userId: users[4]?._id, clonedAt: new Date(Date.now() - 43200000) }
        ],
        views: 234,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[2]?._id || users[0]._id,
        tripId: trips[2]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Cultural Immersion in Japan 🗾",
        description: "Two weeks exploring the rich culture of Japan. From the bustling streets of Tokyo to the peaceful temples of Kyoto, every moment was filled with wonder. The cherry blossom season was absolutely magical. Don't forget to try authentic ramen and visit the Fushimi Inari shrine!",
        coverImage: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["japan", "culture", "tokyo", "kyoto", "cherry-blossoms"],
        likes: [users[0]?._id, users[1]?._id, users[3]?._id, users[4]?._id],
        comments: [
          { userId: users[1]?._id, text: "The cherry blossoms must have been stunning! 🌸", createdAt: new Date(Date.now() - 1800000) },
          { userId: users[4]?._id, text: "How was the language barrier? I'm worried about that.", createdAt: new Date(Date.now() - 900000) }
        ],
        clones: [{ userId: users[0]?._id, clonedAt: new Date(Date.now() - 129600000) }],
        views: 189,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[3]?._id || users[0]._id,
        tripId: trips[3]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Relaxing Beach Vacation in Maldives 🏝️",
        description: "Pure paradise! Spent 7 days in an overwater bungalow in the Maldives. Crystal clear waters, white sandy beaches, and incredible marine life. Perfect for relaxation and snorkeling. The sunset views from our private deck were absolutely breathtaking.",
        coverImage: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["maldives", "beach", "relaxation", "luxury", "snorkeling"],
        likes: [users[0]?._id, users[1]?._id, users[2]?._id, users[4]?._id],
        comments: [
          { userId: users[0]?._id, text: "This is my dream vacation! 😍", createdAt: new Date(Date.now() - 5400000) },
          { userId: users[2]?._id, text: "Which resort did you stay at? Looking for recommendations.", createdAt: new Date(Date.now() - 2700000) }
        ],
        clones: [
          { userId: users[1]?._id, clonedAt: new Date(Date.now() - 86400000) },
          { userId: users[4]?._id, clonedAt: new Date(Date.now() - 43200000) }
        ],
        views: 312,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[4]?._id || users[0]._id,
        tripId: trips[4]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Adventure Trek in Nepal 🏔️",
        description: "Incredible 12-day trek to Everest Base Camp! The journey through the Himalayas was challenging but absolutely rewarding. The local Sherpa guides were amazing, and the views of the world's highest peaks were indescribable. Highly recommend for adventure seekers!",
        coverImage: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["nepal", "everest", "trekking", "adventure", "himalayas"],
        likes: [users[0]?._id, users[1]?._id, users[2]?._id, users[3]?._id],
        comments: [
          { userId: users[0]?._id, text: "This is on my bucket list! How difficult was the trek?", createdAt: new Date(Date.now() - 3600000) },
          { userId: users[1]?._id, text: "Amazing photos! What was the altitude sickness like?", createdAt: new Date(Date.now() - 1800000) }
        ],
        clones: [{ userId: users[2]?._id, clonedAt: new Date(Date.now() - 172800000) }],
        views: 267,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[0]._id,
        tripId: trips[5]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Road Trip Through California Coast 🌊",
        description: "Epic 10-day road trip from San Francisco to San Diego along the Pacific Coast Highway. Stunning coastal views, charming beach towns, and amazing seafood. Highlights included Big Sur, Santa Barbara, and the iconic Golden Gate Bridge. Perfect for nature lovers!",
        coverImage: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["california", "road-trip", "pacific-coast", "usa", "nature"],
        likes: [users[1]?._id, users[2]?._id, users[3]?._id],
        comments: [
          { userId: users[1]?._id, text: "Big Sur is absolutely magical! 🌅", createdAt: new Date(Date.now() - 7200000) },
          { userId: users[3]?._id, text: "How many days would you recommend for this trip?", createdAt: new Date(Date.now() - 3600000) }
        ],
        clones: [{ userId: users[4]?._id, clonedAt: new Date(Date.now() - 86400000) }],
        views: 145,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[1]?._id || users[0]._id,
        tripId: trips[6]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Safari Adventure in Kenya 🦁",
        description: "Unforgettable wildlife safari in the Masai Mara! Saw the Big Five in their natural habitat, witnessed the Great Migration, and stayed in a luxury tented camp. The local Masai guides were incredibly knowledgeable. A truly once-in-a-lifetime experience!",
        coverImage: "https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["kenya", "safari", "wildlife", "africa", "masai-mara"],
        likes: [users[0]?._id, users[2]?._id, users[3]?._id, users[4]?._id],
        comments: [
          { userId: users[0]?._id, text: "The Great Migration must have been spectacular! 🦓", createdAt: new Date(Date.now() - 5400000) },
          { userId: users[2]?._id, text: "Which camp did you stay at? Looking for recommendations.", createdAt: new Date(Date.now() - 2700000) }
        ],
        clones: [
          { userId: users[3]?._id, clonedAt: new Date(Date.now() - 129600000) },
          { userId: users[4]?._id, clonedAt: new Date(Date.now() - 86400000) }
        ],
        views: 298,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[2]?._id || users[0]._id,
        tripId: trips[7]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Cultural Heritage Tour in India 🕌",
        description: "Explored the rich cultural heritage of India through the Golden Triangle. From the majestic Taj Mahal to the vibrant streets of Jaipur, every city had its own unique charm. The local cuisine was absolutely delicious, especially the street food in Delhi!",
        coverImage: "https://images.pexels.com/photos/3581361/pexels-photo-3581361.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["india", "culture", "taj-mahal", "jaipur", "delhi"],
        likes: [users[0]?._id, users[1]?._id, users[3]?._id],
        comments: [
          { userId: users[1]?._id, text: "The Taj Mahal is even more beautiful in person! ✨", createdAt: new Date(Date.now() - 9000000) },
          { userId: users[3]?._id, text: "How was the weather? I'm planning a trip in December.", createdAt: new Date(Date.now() - 4500000) }
        ],
        clones: [{ userId: users[4]?._id, clonedAt: new Date(Date.now() - 172800000) }],
        views: 178,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[3]?._id || users[0]._id,
        tripId: trips[8]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Island Hopping in Greece 🏺",
        description: "Perfect 14-day island hopping adventure through the Greek islands. From the iconic white buildings of Santorini to the party atmosphere of Mykonos, each island had its own personality. The Mediterranean food and stunning sunsets were absolutely perfect!",
        coverImage: "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["greece", "islands", "santorini", "mykonos", "mediterranean"],
        likes: [users[0]?._id, users[1]?._id, users[2]?._id, users[4]?._id],
        comments: [
          { userId: users[0]?._id, text: "Santorini sunsets are magical! 🌅", createdAt: new Date(Date.now() - 3600000) },
          { userId: users[2]?._id, text: "Which islands would you recommend for a first-timer?", createdAt: new Date(Date.now() - 1800000) }
        ],
        clones: [
          { userId: users[1]?._id, clonedAt: new Date(Date.now() - 86400000) },
          { userId: users[4]?._id, clonedAt: new Date(Date.now() - 43200000) }
        ],
        views: 245,
        isPublic: true,
        status: 'active'
      },
      {
        userId: users[4]?._id || users[0]._id,
        tripId: trips[9]?._id || trips[Math.floor(Math.random() * trips.length)]._id,
        title: "Winter Wonderland in Iceland ❄️",
        description: "Magical winter adventure in Iceland! Chased the Northern Lights, explored ice caves, and soaked in the Blue Lagoon. The dramatic landscapes covered in snow were absolutely breathtaking. Don't miss the Golden Circle tour and the black sand beaches!",
        coverImage: "https://images.pexels.com/photos/1058759/pexels-photo-1058759.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
        tags: ["iceland", "northern-lights", "winter", "adventure", "aurora"],
        likes: [users[0]?._id, users[1]?._id, users[2]?._id, users[3]?._id],
        comments: [
          { userId: users[0]?._id, text: "The Northern Lights must have been incredible! 🌌", createdAt: new Date(Date.now() - 7200000) },
          { userId: users[1]?._id, text: "How cold was it? I'm worried about the weather.", createdAt: new Date(Date.now() - 3600000) }
        ],
        clones: [{ userId: users[2]?._id, clonedAt: new Date(Date.now() - 129600000) }],
        views: 223,
        isPublic: true,
        status: 'active'
      }
    ];

    const posts = await CommunityPost.create(demoPosts);

    console.log('✅ Community posts seeded successfully!');
    console.log(`📊 Created ${posts.length} demo community posts`);
    console.log('🎉 Community features are now ready!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding community posts:', error);
    process.exit(1);
  }
}

seedCommunityPosts();
