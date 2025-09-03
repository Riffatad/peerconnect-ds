// client/src/lib/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

async function http(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  API_BASE,

  // Users
  createUser: (body) =>
    http(`/users/`, { method: "POST", body: JSON.stringify(body) }),

  listUsers: () => http(`/users/`),

  getUser: (id) => http(`/users/${id}`),

  updateUser: (id, body) =>
    http(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),

  deleteUser: (id) => http(`/users/${id}`, { method: "DELETE" }),

  // Convenience helpers
  async findUserByEmail(email) {
    const users = await this.listUsers();
    return (users || []).find((u) => u.email?.toLowerCase() === email?.toLowerCase()) || null;
  },

  // Day 4 recommender endpoint (optional; ignore if you didn't add a backend route)
  recommend: (userId) => http(`/users/match/${userId}`),
};

export default api;
export { API_BASE };
