const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const postRoutes = require('./routes/post'); // Make sure this file exists

const app = express();

// ✅ Custom CORS Middleware
app.use(cors({
  origin: 'https://your-frontend.vercel.app', // Replace with your actual frontend URL
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('BLOG api running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
