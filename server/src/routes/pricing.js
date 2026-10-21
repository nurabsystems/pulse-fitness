// src/routes/pricing.js

import express from 'express';
import { pricingController } from '../controllers/pricingController.js';

export const pricingRouter = express.Router();

pricingRouter.get('/', pricingController.getAll);