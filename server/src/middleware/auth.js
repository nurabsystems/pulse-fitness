// server/src/middleware/auth.js
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

export const requireAuth = async (req, res, next) => {
  try {
      // 1. Get session from Better Auth using the request headers
      // 2. Convert request headers for Better Auth and check for an active user session
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // 2. If there is no active session, stop and send an Unauthorized response
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in first.' });
    }

    // 3. Attach the logged-in user to the request object so future routes can access it
    req.user = session.user;

    // 4. Everything is good, move on to the next function or route handler
    next();

  } catch (error) {
    // 5. Catch any unexpected server errors during authentication
    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};