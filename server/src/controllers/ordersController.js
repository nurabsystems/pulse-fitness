// server/src/controllers/ordersController.js
import { db } from "../db/index.js";
//import { orders } from "../db/schema.js";
import { orders, orderItems } from '../db/schema.js';
import { eq, and, desc } from "drizzle-orm"; // <-- Added 'and' and 'desc'
import Stripe from "stripe";
import PDFDocument from 'pdfkit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const ordersController = {
  async getLatestOrder(req, res) {
    try {
      // Assuming your auth middleware sets req.user
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const [latestOrder] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.userId, userId), eq(orders.status, "paid")))
        .orderBy(desc(orders.createdAt))
        .limit(1);

      if (!latestOrder) {
        return res.json({ order: null });
      }

      res.json({ order: latestOrder });
    } catch (error) {
      console.error("Error fetching latest order:", error);
      res.status(500).json({ error: "Failed to fetch latest order" });
    }
  },


    async getInvoice(req, res) {
    try {
      const { id } = req.params;

      // Fetch order + items
      const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      // Create the PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Send the file to the browser
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${id.slice(0,8)}.pdf"`);
      doc.pipe(res);

      // --- PDF CONTENT ---
      doc.fontSize(24).fillColor('#00E676').text('Pulse Fitness', { align: 'left' });
      doc.fontSize(10).fillColor('#666666').text('Invoice / Receipt', { align: 'left' });
      doc.moveDown();

      doc.fontSize(12).fillColor('#000000').text(`Order ID: ${order.id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Status: ${order.status.toUpperCase()}`);
      doc.moveDown();

      doc.fontSize(14).text('Items', { underline: true });
      doc.moveDown(0.5);

      items.forEach(item => {
        doc.fontSize(12).text(`${item.name}`, { continued: true });
        doc.text(`€${(item.price / 100).toFixed(2)}`, { align: 'right' });
      });

      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(14).font('Helvetica-Bold').text(`Total: €${(order.total / 100).toFixed(2)}`, { align: 'right' });
      
      doc.moveDown(4);
      doc.fontSize(10).font('Helvetica').fillColor('#999999').text('Thank you for training with Pulse Fitness!', { align: 'center' });

      doc.end();
    } catch (error) {
      console.error('Invoice error:', error);
      res.status(500).json({ error: 'Failed to generate invoice' });
    }
  },

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const { session_id } = req.query; // Get the session_id from the URL

      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, id))
        .limit(1);

      if (!order || order.length === 0) {
        return res.status(404).json({ error: "Order not found" });
      }

      // If the order is pending and we have a session_id, verify it with Stripe directly
      if (order[0].status === "pending" && session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // If Stripe says it's paid, update the DB immediately
        // (This acts as a fallback if the webhook is slow or fails)
        if (session.payment_status === "paid") {
          const updatedOrder = await db
            .update(orders)
            .set({ status: "paid" })
            .where(eq(orders.id, id))
            .returning();

          return res.json({ order: updatedOrder[0] });
        }
      }

      res.json({ order: order[0] });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  },
};
