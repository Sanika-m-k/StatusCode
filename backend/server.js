const express = require('express');
const cors = require('cors');  
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Routes
app.use('/api/users', userRoutes);

// Initialize server
const startServer = async () => {
  // Connect to database
  await connectDB();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Run server
startServer().catch(err => console.error('Failed to start server:', err));