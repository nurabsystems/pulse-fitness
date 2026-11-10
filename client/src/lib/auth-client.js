// client/src/lib/auth-client.js
/*
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:4000",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
*/

// client/src/lib/auth-client.js
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://pulse-fitness-y1fa.onrender.com/api",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
