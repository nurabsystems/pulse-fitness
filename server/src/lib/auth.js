// src/lib/auth.js
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:4000',
  trustedOrigins: [process.env.CLIENT_URL || 'http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // In dev, Resend's sandbox allows sending to your verified email
      // In production, use Resend, SendGrid, etc.
      console.log(`\n📧 Password reset email for ${user.email}`);
      console.log(`🔗 Reset URL: ${url}\n`);
      
      await resend.emails.send({
        from: 'Pulse Fitness <onboarding@resend.dev>',  // sandbox sender
        to: user.email,
        subject: 'Reset your Pulse Fitness password',
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #00E676;">Reset Your Password</h2>
            <p>Hi ${user.name},</p>
            <p>Click the button below to reset your Pulse Fitness password:</p>
            <a href="${url}" style="display: inline-block; background: #00E676; color: #0D1117; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              Reset Password
            </a>
            <p style="color: #666; font-size: 14px;">Or copy this link: ${url}</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });
    },
  },
});