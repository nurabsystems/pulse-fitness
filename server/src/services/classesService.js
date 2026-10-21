// src/services/classesService.js

import { db } from '../db/index.js';
import { classes } from '../db/schema.js';

export const classesService = {
  async getAll() {
    return await db.select().from(classes);
  },
};