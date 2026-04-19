const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const outageRoutes = require('./routes/outageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/outage_guardian')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/outages', outageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));