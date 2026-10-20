// src/db/schema.js
// Drizzle table definitions. We'll add tables in the next phase.

import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

// Placeholder table — we'll replace this in Phase 1.4
export const connectionTest = pgTable('connection_test', {
  id: uuid('id').primaryKey().defaultRandom(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});