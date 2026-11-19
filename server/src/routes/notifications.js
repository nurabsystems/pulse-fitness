import express from 'express';
import { notificationsController } from '../controllers/notificationsController.js';
import { requireAuth } from '../middleware/auth.js';

export const notificationsRouter = express.Router();

notificationsRouter.use(requireAuth);
notificationsRouter.get('/', notificationsController.getNotifications);
notificationsRouter.put('/:id/read', notificationsController.markAsRead);