// src/services/trainersService.js — DB layer, no HTTP knowledge

import { db } from '../db/index.js';
// Note: we'll import the trainers table in Phase 1.4

export const trainersService = {
  async getAll() {
    // Placeholder — will return real data in Phase 1.4
    return [
      { id: 'placeholder-1', name: 'Alex Rivera', specialty: 'HIIT' },
      { id: 'placeholder-2', name: 'Maya Chen', specialty: 'Strength' },
    ];
  },

  async getById(id) {
    return { id, name: 'Placeholder Trainer', specialty: 'HIIT' };
  },
};