// src/lib/api.js
// Central place for all API calls.
// Change the base URL in one place, everything follows.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  getTrainers: () => request('/trainers'),
  getTrainerById: (id) => request(`/trainers/${id}`),
};