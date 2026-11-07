// server/src/controllers/usersController.js
import { db } from '../db/index.js';
import { user } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { cloudinary } from '../lib/cloudinary.js';
import multer from 'multer';

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
}).single('avatar'); // The field name must match the frontend FormData

export const usersController = {

  // 1. GET /api/users/me — Get current user's profile
  async getMyProfile(req, res) {
    try {
      const results = await db.select()
        .from(user)
        .where(eq(user.id, req.user.id))
        .limit(1);
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.json({ user: results[0] });

    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  },

  // 2. PUT /api/users/me — Update the user's name and bio
  async updateMyProfile(req, res) {
    try {
      const name = req.body.name;
      const bio = req.body.bio;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' });
      }

      const cleanName = name.trim();
      const cleanBio = bio ? bio.trim() : null;

      // ✅ CORRECT: Only update name, bio, and timestamp. Do NOT touch image here.
      const updatedRows = await db
        .update(user)
        .set({  
          name: cleanName, 
          bio: cleanBio, 
          updatedAt: new Date() 
        })
        .where(eq(user.id, req.user.id))
        .returning();

      return res.json({ user: updatedRows[0] });

    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  },

  // 3. POST /api/users/me/avatar — Update the user's avatar image via Cloudinary
  async uploadAvatar(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: 'File upload failed' });
      }
      if (!req.file) {
        console.error('No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        console.log('File received:', req.file.originalname, req.file.size);

        // Upload the image buffer to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'pulse-fitness/avatars', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        console.log('Cloudinary result:', result.secure_url);

        // Update the database with the Cloudinary URL
        const updated = await db
          .update(user)
          .set({ 
            image: result.secure_url, 
            updatedAt: new Date() 
          })
          .where(eq(user.id, req.user.id))
          .returning();

        console.log('Database updated:', updated[0]?.image);

        return res.json({ user: updated[0] });
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Failed to upload avatar' });
      }
    });
  },
};