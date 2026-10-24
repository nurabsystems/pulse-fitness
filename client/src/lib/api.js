// Hardcoded for the live demo
const API_URL = 'https://pulse-fitness-y1fa.onrender.com/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // This is critical for cookies
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
  getClasses: () => request('/classes'),
  getPricing: () => request('/pricing'),
};