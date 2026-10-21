// src/routes/classes.js

import express from 'express';
import { classesController } from '../controllers/classesController.js';

export const classesRouter = express.Router();

classesRouter.get('/', classesController.getAll);