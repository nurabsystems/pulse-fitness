// server/src/controllers/adminController.js
import { db } from '../db/index.js';
import { user, orders } from '../db/schema.js';
import { eq, sql, count } from 'drizzle-orm';

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
        .where(eq(user.role, 'admin'));
      const totalAdmins = adminCountResult[0]?.count || 0;

      // Total members
      const memberCountResult = await db
        .select({ count: count() })
        .from(user)
        .where(eq(user.role, 'member'));
      const totalMembers = memberCountResult[0]?.count || 0;

      // Total orders
      const orderCountResult = await db.select({ count: count() }).from(orders);
      const totalOrders = orderCountResult[0]?.count || 0;

      // Total revenue (sum of paid orders)
      const revenueResult = await db
        .select({ total: sql`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(eq(orders.status, 'paid'));
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
      console.error('Admin stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
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
          createdAt: user.createdAt,
        })
        .from(user)
        .orderBy(user.createdAt);

      res.json({ users });
    } catch (error) {
      console.error('Admin users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },
};