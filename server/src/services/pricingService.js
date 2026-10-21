// src/services/pricingService.js

import { db } from '../db/index.js';
import { pricing } from '../db/schema.js';

export const pricingService = {
  async getAll() {
    return await db.select().from(pricing);
  },
};