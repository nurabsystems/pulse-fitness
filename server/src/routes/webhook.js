// server/src/routes/webhook.js
import { Resend } from 'resend';
import express from 'express';
import Stripe from 'stripe';
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);
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

    // Send a confirmation email using Resend

    if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const orderId = session.client_reference_id;

  // 1. Mark order as paid
  await db.update(orders)
    .set({ status: 'paid' })
    .where(eq(orders.id, orderId));

  // 2. Fetch order details for the receipt
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  const [customer] = await db.select().from(user).where(eq(user.id, order.userId)).limit(1);

  // 3. Send receipt email (fire-and-forget, don't block webhook response)
  if (customer?.email) {
    void resend.emails.send({
      from: 'Pulse Fitness <onboarding@resend.dev>',
      to: customer.email,
      subject: `Your Pulse Fitness order #${orderId.slice(0, 8)} is confirmed`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00E676;">Payment Confirmed</h2>
          <p>Hi ${customer.name || 'there'},</p>
          <p>Your payment was successful. Here's your receipt:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            ${items.map(item => `
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">€${(item.price / 100).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr>
              <td style="padding: 12px 0; font-weight: bold;">Total</td>
              <td style="padding: 12px 0; font-weight: bold; text-align: right; color: #00E676;">€${(order.total / 100).toFixed(2)}</td>
            </tr>
          </table>
          <p style="color: #666; font-size: 12px;">Order ID: ${orderId}</p>
          <p style="color: #666; font-size: 12px;">If you have any questions, reply to this email.</p>
        </div>
      `,
    });
  }

  console.log(`✅ Order ${orderId} marked as paid and receipt sent to ${customer?.email || 'unknown'}`);
}
  }

  res.json({ received: true });
});

export { router as webhookRouter };