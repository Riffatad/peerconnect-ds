// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [all, setAll] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/users/`);
        const list = await res.json();
        setAll(Array.isArray(list) ? list : []);
        const email = auth.currentUser?.email;
        const mine = (list || []).find((u) => u.email === email) || null;
        setMe(mine);
      } catch (e) {
        console.error("Load users error:", e);
      }
    })();
  }, []);

  const others = useMemo(() => {
    if (!me) return all;
    return all.filter((u) => u.email !== me.email);
  }, [all, me]);

  // tiny overlap score
  const score = (a = [], b = []) => {
    const A = new Set(a.map((x) => (x || "").toLowerCase()));
    const B = new Set(b.map((x) => (x || "").toLowerCase()));
    let s = 0;
    A.forEach((x) => B.has(x) && s++);
    return s;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Your Profile</h2>
              <button
                onClick={() => navigate("/onboarding")}
                className="text-sm bg-indigo-600 text-white rounded px-3 py-1 hover:bg-indigo-700"
              >
                Edit
              </button>
            </div>

            {!me ? (
              <p className="text-slate-600">
                No profile found. Go to Onboarding to create one.
              </p>
            ) : (
              <div className="space-y-2 text-sm">
                <div><b>Name:</b> {me.full_name}</div>
                <div><b>Email:</b> {me.email}</div>
                <div><b>Headline:</b> {me.headline || "—"}</div>
                <div>
                  <b>Skills:</b>{" "}
                  {(me.skills || []).join(", ") || "—"}
                </div>
                <div>
                  <b>Interests:</b>{" "}
                  {(me.interests || []).join(", ") || "—"}
                </div>
                {me.github_url && (
                  <div>
                    <b>GitHub:</b>{" "}
                    <a className="text-indigo-700 underline" href={me.github_url} target="_blank" rel="noreferrer">
                      {me.github_url}
                    </a>
                  </div>
                )}
                {me.colab_url && (
                  <div>
                    <b>Colab:</b>{" "}
                    <a className="text-indigo-700 underline" href={me.colab_url} target="_blank" rel="noreferrer">
                      {me.colab_url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="text-lg font-semibold mb-2">People you may like</h2>
            {others.length === 0 ? (
              <p className="text-slate-600">No other users yet.</p>
            ) : (
              <ul className="space-y-3">
                {others.map((u) => (
                  <li key={u.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{u.full_name} <span className="text-slate-500 text-sm">({u.email})</span></div>
                        <div className="text-sm text-slate-700">{u.headline || "—"}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          <b>Skills:</b> {(u.skills || []).join(", ") || "—"}
                        </div>
                      </div>
                      <div className="text-xs bg-indigo-50 text-indigo-700 rounded-full px-3 py-1">
                        Match: {me ? score(me.skills, u.skills) : 0}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
