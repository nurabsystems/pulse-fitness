// server/src/routes/users.js

import express from 'express';
import { usersController } from '../controllers/usersController.js';
import { requireAuth } from '../middleware/auth.js'; // Makes sure the user is logged in

// 1. Create a new Express router for handling user routes
export const usersRouter = express.Router();

// 2. Route to get the logged-in user's profile
// URL: GET /api/users/me
usersRouter.get('/me', requireAuth, usersController.getMyProfile);

// 3. Route to update the user's name and bio
// URL: PUT /api/users/me
usersRouter.put('/me', requireAuth, usersController.updateMyProfile);

// 4. Route to update the user's avatar image URL
// URL: PUT /api/users/me/avatar
usersRouter.put('/me/avatar', requireAuth, usersController.uploadAvatar);