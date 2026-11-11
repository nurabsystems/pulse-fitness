// src/db/schema.js
// Drizzle table definitions for Pulse Fitness.

import { pgTable, text, uuid, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// --- TRAINERS ---
export const trainers = pgTable('trainers', {
  id: uuid('id').primaryKey().defaultRandom(), // unique identifier for each trainer
  name: text('name').notNull(), // name of the trainer
  specialty: text('specialty').notNull(),  // 'HIIT' | 'Strength' | 'Yoga' 
  bio: text('bio').notNull(), // short biography of the trainer
  image: text('image').notNull(), // URL to the trainer's image
  rating: integer('rating').notNull().default(5),  // base rating out of 5
  createdAt: timestamp('created_at').defaultNow().notNull(), // timestamp when the trainer was created
});

// --- CLASSES ---
export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(), // unique identifier for each class
  day: text('day').notNull(), // day of the week (e.g., 'Monday', 'Tuesday', etc.)
  time: text('time').notNull(), // time of the class
  name: text('name').notNull(), // name of the class
  trainer: text('trainer').notNull(),  // name of trainer (denormalized for now)
  createdAt: timestamp('created_at').defaultNow().notNull(), // timestamp when the class was created
});

// --- PRICING ---
export const pricing = pgTable('pricing', {
  id: uuid('id').primaryKey().defaultRandom(), // unique identifier for each pricing option
  name: text('name').notNull(), // name of the pricing option
  price: integer('price').notNull(),  // in euros
  featured: boolean('featured').notNull().default(false), // indicates if the pricing option is featured
  features: text('features').array().notNull(),  // array of strings
  createdAt: timestamp('created_at').defaultNow().notNull(), // timestamp when the pricing option was created
});


// ============================================================
// BETTER AUTH TABLES
// ============================================================

// --- USERS ---

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('member'),
  bio: text('bio'),
  banned: boolean('banned').notNull().default(false),
  banReason: text('ban_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


// --- SESSIONS ---


export const session = pgTable('session', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

// --- ACCOUNTS ---
export const account = pgTable('account', {
  id: text('id').primaryKey(), // ← This will hold the account's unique identifier
  accountId: text('account_id').notNull(), // ← This will hold the account's unique identifier from the provider
  providerId: text('provider_id').notNull(), // ← This will hold the provider's unique identifier
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }), // ← This will reference the user's unique identifier
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// --- VERIFICATION TOKENS ---
export const verification = pgTable('verification', {
  id: text('id').primaryKey(), // ← This will hold the verification token's unique identifier
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// --- ORDERS ---
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // references Better Auth user
  status: text('status').notNull().default('pending'), // 'pending' or 'paid'
  total: integer('total').notNull(), // in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- ORDER ITEMS ---
export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  pricingId: uuid('pricing_id').notNull(),
  name: text('name').notNull(), // name of the pricing option
  price: integer('price').notNull(), // in cents
});