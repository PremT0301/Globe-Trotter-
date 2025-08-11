const mongoose = require('mongoose');

let isConnecting = false;
const uri = process.env.MONGODB_URI;
async function connectToDatabase(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (isConnecting) {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', reject);
    });
  }

  isConnecting = true;

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // keep defaults minimal for compatibility
  });

  isConnecting = false;

  return mongoose.connection;
}

module.exports = { connectToDatabase };
