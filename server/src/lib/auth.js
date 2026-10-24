// src/lib/auth.js
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins: [
    "https://pulse-fitness-tdsz.vercel.app",
    "http://localhost:5173",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // For demo: log the URL. No external email API required.
      console.log("\n═══════════════════════════════════════");
      console.log(`📧 PASSWORD RESET REQUEST`);
      console.log(`   User: ${user.email}`);
      console.log(`   URL: ${url}`);
      console.log("═══════════════════════════════════════\n");
    },
  },
});