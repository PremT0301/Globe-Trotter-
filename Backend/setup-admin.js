const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

const ADMIN_EMAIL = 'admin@globetrotter.com';
const ADMIN_PASSWORD = 'admin123456';
const ADMIN_NAME = 'Admin User';

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Name: ${existingAdmin.name}`);
      
      // Update role to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
      
      console.log('\n🔑 Admin Credentials:');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('\n⚠️  Please change the password after first login!');
      
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      
      const adminUser = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        role: 'admin',
        emailVerified: true // Admin doesn't need email verification
      });

      await adminUser.save();
      
      console.log('✅ Admin user created successfully!');
      console.log('\n🔑 Admin Credentials:');
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${ADMIN_PASSWORD}`);
      console.log('\n⚠️  Please change the password after first login!');
    }

    console.log('\n🚀 Admin setup complete!');
    console.log('You can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

setupAdmin();
