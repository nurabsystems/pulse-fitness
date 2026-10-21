// src/controllers/pricingController.js

import { pricingService } from '../services/pricingService.js';

export const pricingController = {
  async getAll(req, res) {
    try {
      const pricing = await pricingService.getAll();
      res.json({ pricing });
    } catch (error) {
      console.error('getAll pricing error:', error);
      res.status(500).json({ error: 'Failed to fetch pricing' });
    }
  },
};