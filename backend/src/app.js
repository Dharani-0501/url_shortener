const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const urlController = require('./controllers/urlController');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/urls', analyticsRoutes);

// Server-side Redirection Route
app.get('/:shortCode', urlController.redirectUrl);

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
