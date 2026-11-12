// server/src/controllers/adminController.js
import { db } from "../db/index.js";
import { user, orders, trainers } from "../db/schema.js";
import { eq, sql, count } from "drizzle-orm";


export const adminController = {
  // GET /api/admin/stats — dashboard overview stats
  async getStats(req, res) {
    try {
      // Total users
      const userCountResult = await db.select({ count: count() }).from(user);
      const totalUsers = userCountResult[0]?.count || 0;

      // Total admins
      const adminCountResult = await db
        .select({ count: count() })
        .from(user)
        .where(eq(user.role, "admin"));
      const totalAdmins = adminCountResult[0]?.count || 0;

      // Total members
      const memberCountResult = await db
        .select({ count: count() })
        .from(user)
        .where(eq(user.role, "member"));
      const totalMembers = memberCountResult[0]?.count || 0;

      // Total orders
      const orderCountResult = await db.select({ count: count() }).from(orders);
      const totalOrders = orderCountResult[0]?.count || 0;

      // Total revenue (sum of paid orders)
      const revenueResult = await db
        .select({ total: sql`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(eq(orders.status, "paid"));
      const totalRevenue = revenueResult[0]?.total || 0;

      res.json({
        stats: {
          totalUsers,
          totalAdmins,
          totalMembers,
          totalOrders,
          totalRevenue: Number(totalRevenue) / 100, // Convert cents to euros
        },
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  },

  // GET /api/admin/users — list all users
  async getAllUsers(req, res) {
    try {
      const users = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          banned: user.banned,
          banReason: user.banReason,
          createdAt: user.createdAt,
        })
        .from(user)
        .orderBy(user.createdAt);

      res.json({ users });
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // PUT /api/admin/users/:id/role — promote or demote a user
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role value
      if (!["admin", "member"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Prevent admin from demoting themselves
      if (id === req.user.id) {
        return res
          .status(400)
          .json({ error: "You cannot change your own role" });
      }

      // Prevent demoting the last admin
      if (role === "member") {
        const adminCount = await db
          .select({ count: count() })
          .from(user)
          .where(eq(user.role, "admin"));
        if (adminCount[0]?.count <= 1) {
          return res
            .status(400)
            .json({ error: "Cannot demote the last admin" });
        }
      }

      const updated = await db
        .update(user)
        .set({ role })
        .where(eq(user.id, id))
        .returning();

      if (!updated.length) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: updated[0] });
    } catch (error) {
      console.error("Update role error:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  },

  // PUT /api/admin/users/:id/ban — ban or unban a user
  async toggleUserBan(req, res) {
    try {
      const { id } = req.params;
      const { banned, reason } = req.body;

      if (typeof banned !== "boolean") {
        return res.status(400).json({ error: "Invalid banned value" });
      }

      // Prevent admin from banning themselves
      if (id === req.user.id) {
        return res.status(400).json({ error: "You cannot ban yourself" });
      }

      const updated = await db
        .update(user)
        .set({
          banned,
          banReason: banned ? reason || "No reason provided" : null,
        })
        .where(eq(user.id, id))
        .returning();

      if (!updated.length) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user: updated[0] });
    } catch (error) {
      console.error("Toggle ban error:", error);
      res.status(500).json({ error: "Failed to update user ban status" });
    }
  },

  // DELETE /api/admin/users/:id — delete a user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (id === req.user.id) {
        return res.status(400).json({ error: "You cannot delete yourself" });
      }

      const deleted = await db.delete(user).where(eq(user.id, id)).returning();

      if (!deleted.length) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ success: true, deleted: deleted[0].email });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },

//TRAINERS CRUD

    // POST /api/admin/trainers — create a new trainer
  async createTrainer(req, res) {
    try {
      const { name, specialty, bio, image, rating } = req.body;

      if (!name || !specialty || !bio || !image) {
        return res.status(400).json({ error: 'name, specialty, bio, and image are required' });
      }

      if (!['HIIT', 'Strength', 'Yoga'].includes(specialty)) {
        return res.status(400).json({ error: 'specialty must be HIIT, Strength, or Yoga' });
      }

      const [trainer] = await db
        .insert(trainers)
        .values({
          name: name.trim(),
          specialty,
          bio: bio.trim(),
          image: image.trim(),
          rating: rating || 5,
        })
        .returning();

      res.status(201).json({ trainer });
    } catch (error) {
      console.error('Create trainer error:', error);
      res.status(500).json({ error: 'Failed to create trainer' });
    }
  },

  // PUT /api/admin/trainers/:id — update a trainer
  async updateTrainer(req, res) {
    try {
      const { id } = req.params;
      const { name, specialty, bio, image, rating } = req.body;

      if (specialty && !['HIIT', 'Strength', 'Yoga'].includes(specialty)) {
        return res.status(400).json({ error: 'specialty must be HIIT, Strength, or Yoga' });
      }

      const updates = {};
      if (name) updates.name = name.trim();
      if (specialty) updates.specialty = specialty;
      if (bio) updates.bio = bio.trim();
      if (image) updates.image = image.trim();
      if (rating !== undefined) updates.rating = rating;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const [trainer] = await db
        .update(trainers)
        .set(updates)
        .where(eq(trainers.id, id))
        .returning();

      if (!trainer) {
        return res.status(404).json({ error: 'Trainer not found' });
      }

      res.json({ trainer });
    } catch (error) {
      console.error('Update trainer error:', error);
      res.status(500).json({ error: 'Failed to update trainer' });
    }
  },

  // DELETE /api/admin/trainers/:id — delete a trainer
  async deleteTrainer(req, res) {
    try {
      const { id } = req.params;

      const [deleted] = await db
        .delete(trainers)
        .where(eq(trainers.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ error: 'Trainer not found' });
      }

      res.json({ success: true, deleted: deleted.name });
    } catch (error) {
      console.error('Delete trainer error:', error);
      res.status(500).json({ error: 'Failed to delete trainer' });
    }
  },
};
