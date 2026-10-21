// src/controllers/classesController.js

import { classesService } from '../services/classesService.js';

export const classesController = {
  async getAll(req, res) {
    try {
      const classes = await classesService.getAll();
      res.json({ classes });
    } catch (error) {
      console.error('getAll classes error:', error);
      res.status(500).json({ error: 'Failed to fetch classes' });
    }
  },
};