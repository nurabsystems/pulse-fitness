// server/src/controllers/adminController.js
import { db } from "../db/index.js";
import { user, orders } from "../db/schema.js";
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
};
