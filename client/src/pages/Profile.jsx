// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [me, setMe] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // load profile by email
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const all = await api.listUsers();
        const mine = (all || []).find(u => u.email === user.email) || null;
        setMe(mine);
        setForm(mine || {});
      } catch (e) {
        console.error("Load profile failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!me) return;
    setSaving(true);
    try {
      await api.updateUser(me.id, {
        full_name: form.full_name,
        headline: form.headline,
        skills: (form.skills || "").split(",").map(s => s.trim()).filter(Boolean),
        interests: (form.interests || "").split(",").map(s => s.trim()).filter(Boolean),
        github_url: form.github_url,
        colab_url: form.colab_url,
      });
      alert("✅ Profile updated");
      navigate("/dashboard");
    } catch (e) {
      console.error("Update failed:", e);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading profile…</div>;
  if (!me) return <div className="p-6">No profile found. Please onboard first.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex justify-center items-start py-10">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg shadow-md w-full max-w-lg p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>

        <div>
          <label className="block text-sm font-medium">Full Name *</label>
          <input
            name="full_name"
            value={form.full_name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email *</label>
          <input
            value={me.email}
            disabled
            className="w-full border px-3 py-2 rounded mt-1 bg-slate-100 text-slate-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Headline</label>
          <input
            name="headline"
            value={form.headline || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Skills (comma separated)</label>
          <input
            name="skills"
            value={(form.skills || []).join ? form.skills.join(", ") : form.skills || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Interests (comma separated)</label>
          <input
            name="interests"
            value={(form.interests || []).join ? form.interests.join(", ") : form.interests || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">GitHub URL</label>
          <input
            name="github_url"
            value={form.github_url || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Colab URL</label>
          <input
            name="colab_url"
            value={form.colab_url || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
