// src/index.js — the Express server entry point

import 'dotenv/config';
import { fixCookies } from './middleware/fixCookies.js';
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
// 1. CORS Configuration
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
        return callback(null, false);
      }
    },
    credentials: true,
  })
);

//before better auth middleware, apply the fixCookies middleware to handle cookie issues in development

app.use(fixCookies); // Apply the fixCookies middleware

// =========================================================
// 2. Better Auth (needs raw body)
// =========================================================
app.all('/api/auth/*splat', toNodeHandler(auth));


// =========================================================
// 3. Stripe Webhook (needs raw body)
// =========================================================
app.use('/api/webhook', webhookRouter);

// =========================================================
// 4. JSON Body Parser (BEFORE all other API routes)
// =========================================================
app.use(express.json());

// =========================================================
// 5. All other API routes (now with parsed JSON body)
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
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);

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