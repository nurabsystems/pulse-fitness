// src/routes/trainers.js — wires HTTP URLs to controllers

import express from 'express';
import { trainersController } from '../controllers/trainersController.js';

export const trainersRouter = express.Router();

trainersRouter.get('/', trainersController.getAll);
trainersRouter.get('/:id', trainersController.getById);