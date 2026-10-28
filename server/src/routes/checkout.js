// server/src/routes/checkout.js
import express from 'express';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import { orders, orderItems, pricing } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', requireAuth, async (req, res) => {
  try {
    const { pricingId } = req.body;
    const userId = req.user.id;

    if (!pricingId) {
      return res.status(400).json({ error: 'Pricing ID is required.' });
    }

    // 1. Look up the real price from the database (Never trust the frontend)
    const plan = await db.select().from(pricing).where(eq(pricing.id, pricingId)).limit(1);
    
    if (!plan || plan.length === 0) {
      return res.status(404).json({ error: 'Pricing plan not found.' });
    }

    const realPrice = plan[0].price;
    const planName = plan[0].name;

    // 2. Create the order record (status: pending)
    const [newOrder] = await db.insert(orders).values({
      userId: userId,
      total: realPrice * 100, // Stripe expects cents (€49 -> 4900)
      status: 'pending',
    }).returning();

    // 3. Save the order item
    await db.insert(orderItems).values({
      orderId: newOrder.id,
      pricingId: plan[0].id,
      name: planName,
      price: realPrice * 100,
    });

    // 4. Create Stripe Checkout Session
    // Note: For production, 'CLIENT_URL' will be your Vercel URL. For local, it's localhost:5173
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${planName} Membership`,
            },
            unit_amount: realPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder.id}`,
      cancel_url: `${clientUrl}/#pricing`,
      client_reference_id: newOrder.id,
      customer_email: req.user.email,
    });

    // 5. Send the Stripe URL back to the client
    res.json({ url: session.url, orderId: newOrder.id });

  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

export { router as checkoutRouter };