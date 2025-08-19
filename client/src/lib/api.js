// src/lib/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

async function http(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return res.json();
}

export async function createUser(payload) {
  return http("/users/", { method: "POST", body: JSON.stringify(payload) });
}

export async function listUsers() {
  return http("/users/");
}

export async function findUserByEmail(email) {
  const items = await listUsers();
  return (items || []).find((u) => u.email === email) || null;
}

export async function updateUser(userId, payload) {
  return http(`/users/${userId}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export { API_BASE };
