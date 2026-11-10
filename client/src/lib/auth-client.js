// client/src/lib/auth-client.js
import { createAuthClient } from "better-auth/react";

// Derive the auth base URL from the API URL.
// VITE_API_URL should be like "http://localhost:4000/api" or "https://pulse-fitness-y1fa.onrender.com/api"
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const authBaseUrl = apiUrl.replace(/\/api$/, "");

console.log('[auth-client] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('[auth-client] authBaseUrl:', authBaseUrl);

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;