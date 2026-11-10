// server/src/routes/admin.js
import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

export const adminRouter = express.Router();

// All admin routes require authentication + admin role
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get('/stats', adminController.getStats);
adminRouter.get('/users', adminController.getAllUsers);