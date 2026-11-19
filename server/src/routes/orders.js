// server/src/routes/orders.js
import express from 'express';
import { ordersController } from '../controllers/ordersController.js';

export const ordersRouter = express.Router();

// ADD THIS LINE FIRST
ordersRouter.get('/latest', ordersController.getLatestOrder);

// Keep this below it
ordersRouter.get('/:id', ordersController.getOrderById);











