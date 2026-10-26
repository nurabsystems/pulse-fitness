// src/db/schema.js
// Drizzle table definitions for Pulse Fitness.

import { pgTable, text, uuid, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// --- TRAINERS ---
export const trainers = pgTable('trainers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  specialty: text('specialty').notNull(),  // 'HIIT' | 'Strength' | 'Yoga'
  bio: text('bio').notNull(),
  image: text('image').notNull(),
  rating: integer('rating').notNull().default(5),  // base rating out of 5
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- CLASSES ---
export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  day: text('day').notNull(),
  time: text('time').notNull(),
  name: text('name').notNull(),
  trainer: text('trainer').notNull(),  // name of trainer (denormalized for now)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- PRICING ---
export const pricing = pgTable('pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: integer('price').notNull(),  // in euros
  featured: boolean('featured').notNull().default(false),
  features: text('features').array().notNull(),  // array of strings
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


// ============================================================
// BETTER AUTH TABLES
// ============================================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
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

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
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
  name: text('name').notNull(),
  price: integer('price').notNull(), // in cents
});