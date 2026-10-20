// src/controllers/trainersController.js — HTTP layer

import { trainersService } from '../services/trainersService.js';

export const trainersController = {
  async getAll(req, res) {
    try {
      const trainers = await trainersService.getAll();
      res.json({ trainers });
    } catch (error) {
      console.error('getAll error:', error);
      res.status(500).json({ error: 'Failed to fetch trainers' });
    }
  },

  async getById(req, res) {
    try {
      const trainer = await trainersService.getById(req.params.id);
      if (!trainer) return res.status(404).json({ error: 'Trainer not found' });
      res.json({ trainer });
    } catch (error) {
      console.error('getById error:', error);
      res.status(500).json({ error: 'Failed to fetch trainer' });
    }
  },
};