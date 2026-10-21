// src/services/trainersService.js — DB layer, no HTTP knowledge

import { db } from '../db/index.js';
import { trainers } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const trainersService = {
  async getAll() {
    return await db.select().from(trainers);
  },

  async getById(id) {
    const [trainer] = await db.select().from(trainers).where(eq(trainers.id, id));
    return trainer || null;
  },
};