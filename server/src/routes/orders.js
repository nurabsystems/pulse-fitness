import express from 'express';
import { ordersController } from '../controllers/ordersController.js';

export const ordersRouter = express.Router();

ordersRouter.get('/:id', ordersController.getOrderById);