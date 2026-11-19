// server/src/routes/webhook.js
import { Resend } from "resend";
import express from "express";
import Stripe from "stripe";
import { db } from "../db/index.js";
import { orders, orderItems, user, notifications } from "../db/schema.js";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// We need the RAW body for Stripe signature verification
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } else {
        event = JSON.parse(req.body.toString());
      }
    } catch (err) {
      console.error("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔔 Webhook event received:", event.type);

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.client_reference_id;

      console.log("🔔 Processing order:", orderId);

      try {
        // 1. Mark order as paid and set renewal date (30 days from now)
        const renewsAt = new Date();
        renewsAt.setDate(renewsAt.getDate() + 30);

        await db
          .update(orders)
          .set({ status: "paid", renewsAt: renewsAt })
          .where(eq(orders.id, orderId));
        console.log("✅ Order marked as paid:", orderId);

        // 2. Fetch order
        const [order] = await db
          .select()
          .from(orders)
          .where(eq(orders.id, orderId))
          .limit(1);

        if (!order) {
          console.error("❌ Order not found in DB:", orderId);
          return res.json({ received: true });
        }

        console.log(
          "📦 Order fetched. userId:",
          order.userId,
          "total:",
          order.total,
        );

        // 3. Fetch line items
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, orderId));

        console.log("🛒 Items fetched:", items.length);

        // 4. Fetch customer
        const [customer] = await db
          .select()
          .from(user)
          .where(eq(user.id, order.userId))
          .limit(1);

        console.log("👤 Customer fetched:", customer?.email || "NONE");

      // 5. Create notification
      await db.insert(notifications).values({
        userId: order.userId,
        title: 'Order Confirmed',
        message: `Your order #${orderId.slice(0, 8)} is confirmed. Thank you for your purchase!`,
      });

        // 6. Send email receipt using Resend
        if (!customer?.email) {
          console.log("❌ No customer email — skipping receipt");
        } else {
          console.log("📧 Attempting to send email to:", customer.email);
          console.log(
            "📧 From address:",
            process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          );
          console.log("📧 API key present:", !!process.env.RESEND_API_KEY);

          try {
            const result = await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL
                ? `Pulse Fitness <${process.env.RESEND_FROM_EMAIL}>`
                : "Pulse Fitness <onboarding@resend.dev>",
              to: customer.email,
              subject: `Your Pulse Fitness order #${orderId.slice(0, 8)} is confirmed`,
              html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #00E676;">Payment Confirmed</h2>
                <p>Hi ${customer.name || "there"},</p>
                <p>Your payment was successful. Here's your receipt:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">€${(item.price / 100).toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
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

            console.log("📬 Resend API response:", JSON.stringify(result));

            if (result.error) {
              console.error("❌ Resend returned an error:", result.error);
            } else {
              console.log(
                "✅ Email sent successfully. Message ID:",
                result.data?.id,
              );
            }
          } catch (emailErr) {
            console.error("❌ Resend exception:", emailErr);
          }
        }
      } catch (err) {
        console.error("❌ Webhook handler error:", err);
      }
    }

    res.json({ received: true });
  },
);

export { router as webhookRouter };
