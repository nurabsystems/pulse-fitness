// src/index.js — the Express server entry point

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './db/index.js';
import { trainersRouter } from './routes/trainers.js';
import { classesRouter } from './routes/classes.js';
import { pricingRouter } from './routes/pricing.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check — proves the server is up
app.get('/api/health', async (req, res) => {
  try {
    const now = await testConnection();
    res.json({ status: 'ok', database: 'connected', time: now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Routes
app.use('/api/trainers', trainersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/pricing', pricingRouter);
// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start
app.listen(PORT, () => {
  console.log(`Pulse Fitness API running on http://localhost:${PORT}`);
});