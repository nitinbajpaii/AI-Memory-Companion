const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const profileRoutes = require('./routes/profileRoutes');
const { checkDbConnection } = require('./middleware/dbStatus');

// Startup Check
const requiredEnv = ['OPENAI_API_KEY', 'JWT_SECRET', 'MONGO_URI'];
const missingEnv = requiredEnv.filter(env => !process.env[env] || process.env[env].includes('your_') || process.env[env].includes('<'));

if (missingEnv.length > 0) {
  console.log('\n--- ⚠️ STARTUP WARNING ---');
  console.log('The following environment variables are not configured correctly in backend/.env:');
  missingEnv.forEach(env => console.log(`  - ${env}`));
  console.log('App will start, but features using these variables will fail.');
  console.log('--------------------------\n');
}

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Check DB Connection for all API routes
app.use('/api', checkDbConnection);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('AI Memory Companion API is running...');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Try a different port or kill the process using it.`);
  } else {
    console.error(`Server Error: ${err.message}`);
  }
});
