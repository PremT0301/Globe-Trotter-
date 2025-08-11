const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

async function checkAdminUser() {
  try {
    console.log('🔍 Checking Admin User in Database...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@globetrotter.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found!');
      console.log('ID:', adminUser._id);
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('Role:', adminUser.role);
      console.log('Email Verified:', adminUser.emailVerified);
      console.log('Created At:', adminUser.createdAt);
      console.log('Updated At:', adminUser.updatedAt);
      
      if (adminUser.role === 'admin') {
        console.log('\n🎉 Admin user has correct role!');
      } else {
        console.log('\n⚠️  Admin user exists but role is not "admin"');
        console.log('Current role:', adminUser.role);
      }
    } else {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('admin123456', 12);
      
      const newAdminUser = new User({
        name: 'Admin User',
        email: 'admin@globetrotter.com',
        passwordHash: passwordHash,
        role: 'admin',
        emailVerified: true
      });
      
      await newAdminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Role:', newAdminUser.role);
    }

    // Check all users and their roles
    console.log('\n📊 All Users in Database:');
    const allUsers = await User.find({}).select('name email role emailVerified createdAt');
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Verified: ${user.emailVerified}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkAdminUser();
