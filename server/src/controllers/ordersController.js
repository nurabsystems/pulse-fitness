// server/src/controllers/ordersController.js
import { db } from '../db/index.js';
import { orders } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const ordersController = {
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const { session_id } = req.query; // Get the session_id from the URL

      const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      
      if (!order || order.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // If the order is pending and we have a session_id, verify it with Stripe directly
      if (order[0].status === 'pending' && session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        // If Stripe says it's paid, update the DB immediately 
        // (This acts as a fallback if the webhook is slow or fails)
        if (session.payment_status === 'paid') {
          const updatedOrder = await db.update(orders)
            .set({ status: 'paid' })
            .where(eq(orders.id, id))
            .returning();
            
          return res.json({ order: updatedOrder[0] });
        }
      }
      
      res.json({ order: order[0] });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }
};