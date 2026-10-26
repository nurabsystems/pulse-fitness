// server/src/routes/webhook.js
import express from 'express';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// We need the RAW body for Stripe signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // NOTE: You will need a STRIPE_WEBHOOK_SECRET in your .env for production
    // For local testing with Stripe CLI, we skip strict verification or use the CLI secret
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback for quick testing if secret is not set yet
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.client_reference_id;

    // Mark the order as paid in PostgreSQL
    await db.update(orders)
      .set({ status: 'paid' })
      .where(eq(orders.id, orderId));
      
    console.log(`✅ Order ${orderId} marked as paid.`);
  }

  res.json({ received: true });
});

export { router as webhookRouter };