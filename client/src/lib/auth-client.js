// client/src/lib/auth-client.js
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  // Hardcoded for the live demo
  baseURL: 'https://pulse-fitness-y1fa.onrender.com',
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;