// server/src/routes/orders.js
import express from 'express';
import { ordersController } from '../controllers/ordersController.js';

export const ordersRouter = express.Router();

//  THIS LINE COMES FIRST

// Route to get the latest order for the authenticated user
ordersRouter.get('/latest', ordersController.getLatestOrder);



//  route for invoice generation
ordersRouter.get('/:id/invoice', ordersController.getInvoice);


// route to get order by ID
ordersRouter.get('/:id', ordersController.getOrderById);











