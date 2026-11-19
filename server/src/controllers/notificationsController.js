// server/src/controllers/notificationsController.js
import { db } from '../db/index.js';
import { notifications } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const notificationsController = {
  // GET /api/notifications
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(20);

      res.json({ notifications: userNotifications });
    } catch (error) {
      console.error('Fetch notifications error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },

  // PUT /api/notifications/:id/read
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const updated = await db
        .update(notifications)
        .set({ read: true })
        .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
        .returning();

      if (!updated.length) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ notification: updated[0] });
    } catch (error) {
      console.error('Mark notification read error:', error);
      res.status(500).json({ error: 'Failed to mark as read' });
    }
  }
};