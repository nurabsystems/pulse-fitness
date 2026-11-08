// src/index.js — the Express server entry point

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { testConnection } from './db/index.js';
import { trainersRouter } from './routes/trainers.js';
import { classesRouter } from './routes/classes.js';
import { pricingRouter } from './routes/pricing.js';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import { checkoutRouter } from './routes/checkout.js';
import { webhookRouter } from './routes/webhook.js';
import { ordersRouter } from './routes/orders.js';
import { usersRouter } from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 4000;

// =========================================================
// 1. CORS Configuration (Fixes local dev and production)
// =========================================================
const allowedOrigins = [
  'http://localhost:5173',
  'https://pulse-fitness-tdsz.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// =========================================================
// 2. Better Auth (BEFORE express.json())
// =========================================================
app.all('/api/auth/*splat', toNodeHandler(auth));

// =========================================================
// 3. Raw Body Routes (Webhook & Orders)
// =========================================================
app.use('/api/webhook', webhookRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);

// =========================================================
// 4. JSON Body Parser
// =========================================================
app.use(express.json());

// =========================================================
// 5. Standard Routes
// =========================================================
app.get('/api/health', async (req, res) => {
  try {
    const now = await testConnection();
    res.json({ status: 'ok', database: 'connected', time: now });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.use('/api/trainers', trainersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/checkout', checkoutRouter);

// =========================================================
// 6. 404 Fallback
// =========================================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// =========================================================
// 7. Start Server
// =========================================================
app.listen(PORT, () => {
  console.log(`Pulse Fitness API running on http://localhost:${PORT}`);
});