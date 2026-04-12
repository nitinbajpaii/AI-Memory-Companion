const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>')) {
    console.error('⚠️  WARNING: MONGO_URI is missing or contains placeholder values. Database features will not work.');
    console.error('Please update your backend/.env file with a real MongoDB Atlas connection string.');
    return; // Don't exit, let server start for demo/dev purposes
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`);
    // Still don't exit, let developer see the error and fix .env
  }
};

module.exports = connectDB;
