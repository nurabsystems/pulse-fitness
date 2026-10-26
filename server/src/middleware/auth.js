// server/src/middleware/auth.js
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export const requireAuth = async (req, res, next) => {
  try {
    // Get session from Better Auth using the request headers
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in first.' });
    }

    // Attach the user to the request so the next function can use it
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};