import { db } from '../db/index.js';
import { user } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function requireAdmin(req, res, next) {
  // 1. Check if the user is logged in
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Fetch the user from the database using their ID
  const result = await db.select().from(user).where(eq(user.id, req.user.id)).limit(1);
  const currentUser = result[0];

  // 3. Check if the user exists and has the 'admin' role
  if (!currentUser || currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  // 4. If they are an admin, move on to the next function/route
  next();
}