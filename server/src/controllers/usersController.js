// server/src/controllers/usersController.js
import { db } from '../db/index.js';
import { user } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { cloudinary } from '../lib/cloudinary.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('avatar');

export const usersController = {
  async getMyProfile(req, res) {
    try {
      const results = await db
        .select()
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

  async updateMyProfile(req, res) {
    try {
      const { name, bio } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Name must be at least 2 characters' });
      }

      const updated = await db
        .update(user)
        .set({ name: name.trim(), bio: bio?.trim() || null })
        .where(eq(user.id, req.user.id))
        .returning();

      return res.json({ user: updated[0] });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  },

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

        const updated = await db
          .update(user)
          .set({ image: result.secure_url, updatedAt: new Date() })
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