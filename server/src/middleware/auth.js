// server/src/middleware/auth.js
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
export const requireAuth = async (req, res, next) => {
  try {
    console.log('=== AUTH CHECK ===');
    console.log('Cookie header:', req.headers.cookie?.substring(0, 80));
    console.log('Origin:', req.headers.origin);
    
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    
    console.log('Session result:', session);

    if (!session || !session.user) {
      console.log('→ No user in session, returning 401');
      return res.status(401).json({ error: 'Unauthorized. Please sign in first.' });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
};