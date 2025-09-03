// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api"; // default export

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();           // only to know who's logged-in
  const [list, setList] = useState([]); // all users from backend
  const [me, setMe]   = useState(null); // current user's row from backend
  const [loading, setLoading] = useState(true);

  // If no Firebase user, kick to /login
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Load users from backend and locate "me" by email
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const all = await api.listUsers();                 // GET /users/
        setList(Array.isArray(all) ? all : []);
        const mine = (all || []).find(u => u.email === user.email) || null;
        setMe(mine);
      } catch (e) {
        console.error("Failed to load users:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Simple overlap score for “People you may like”
  const score = (a = [], b = []) => {
    const A = new Set((a || []).map(x => (x || "").toLowerCase()));
    const B = new Set((b || []).map(x => (x || "").toLowerCase()));
    let s = 0; A.forEach(x => B.has(x) && s++);
    return s;
  };

  // Everyone except me
  const others = useMemo(() => {
    if (!me) return list;
    return list.filter(u => u.email !== me.email);
  }, [list, me]);

  if (!user) return null; // brief flash while redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Profile */}
          <section className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Your Profile</h2>
              <button
                onClick={() => navigate("/onboarding")}
                className="text-sm bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700"
              >
                Edit
              </button>
            </div>

            {!me ? (
              <p className="text-slate-600">
                No profile found. Go to <b>Onboarding</b> to create one.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <div><b>Name:</b> {me.full_name}</div>
                <div><b>Email:</b> {me.email}</div>
                <div><b>Headline:</b> {me.headline || "—"}</div>
                <div>
                  <b>Skills:</b> {(me.skills || []).join(", ") || "—"}
                </div>
                <div>
                  <b>Interests:</b> {(me.interests || []).join(", ") || "—"}
                </div>
                {me.github_url && (
                  <div>
                    <b>GitHub:</b>{" "}
                    <a
                      className="text-indigo-700 underline"
                      href={me.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {me.github_url}
                    </a>
                  </div>
                )}
                {me.colab_url && (
                  <div>
                    <b>Colab:</b>{" "}
                    <a
                      className="text-indigo-700 underline"
                      href={me.colab_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {me.colab_url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* People you may like */}
          <section className="bg-white rounded-lg shadow p-5">
            <h2 className="text-xl font-semibold mb-3">People you may like</h2>
            {others.length === 0 ? (
              <p className="text-slate-600">No other users yet.</p>
            ) : (
              <ul className="space-y-3">
                {others.map((u) => (
                  <li key={u.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">
                          {u.full_name}{" "}
                          <span className="text-slate-500 text-sm">
                            ({u.email})
                          </span>
                        </div>
                        <div className="text-sm text-slate-700">
                          {u.headline || "—"}
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          <b>Skills:</b> {(u.skills || []).join(", ") || "—"}
                        </div>
                        {(u.interests || []).length > 0 && (
                          <div className="text-xs text-slate-600">
                            <b>Interests:</b>{" "}
                            {(u.interests || []).join(", ")}
                          </div>
                        )}
                      </div>
                      <div className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">
                        Match: {me ? score(me.skills, u.skills) : 0}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
