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