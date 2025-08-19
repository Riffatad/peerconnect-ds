// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { findUserByEmail, updateUser } from "../lib/api";

// normalize to "a, b, c" for the form input
const toCsv = (v) => {
  if (Array.isArray(v)) return v.join(", ");
  if (v == null) return "";
  return String(v);
};

// convert "a, b, c" -> ["a","b","c"]
const fromCsv = (s) =>
  (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [userRecord, setUserRecord] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login";
        return;
      }
      try {
        const rec = await findUserByEmail(u.email);
        setUserRecord(rec || null);
        reset({
          full_name: rec?.full_name || "",
          email: rec?.email || u.email || "",
          headline: rec?.headline || "",
          skills_csv: toCsv(rec?.skills),
          interests_csv: toCsv(rec?.interests),
          github_url: rec?.github_url || "",
          colab_url: rec?.colab_url || "",
        });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [reset]);

  const onSubmit = async (vals) => {
    if (!userRecord?.id) {
      alert("No profile found to update. Please create one on Onboarding.");
      return;
    }
    const payload = {
      full_name: vals.full_name || "",
      email: vals.email || "",
      headline: vals.headline || null,
      skills: fromCsv(vals.skills_csv),
      interests: fromCsv(vals.interests_csv),
      github_url: vals.github_url || null,
      colab_url: vals.colab_url || null,
    };
    try {
      await updateUser(userRecord.id, payload);
      alert("Profile updated!");
    } catch (e) {
      console.error("Update error:", e);
      alert("Failed to update. Check backend and console.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-slate-600">Loading profile…</div>
      </div>
    );
  }

  if (!userRecord) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="bg-white p-6 rounded shadow max-w-lg text-center">
          <h1 className="text-xl font-semibold mb-2">No profile yet</h1>
          <p className="text-slate-600 mb-4">
            Create your profile on the Onboarding page.
          </p>
          <a
            href="/onboarding"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Go to Onboarding
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
        <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Full Name *</label>
              <input className="w-full border rounded px-3 py-2" {...register("full_name", { required: true })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input className="w-full border rounded px-3 py-2" type="email" {...register("email", { required: true })} readOnly />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Headline</label>
            <input className="w-full border rounded px-3 py-2" {...register("headline")} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Skills (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" {...register("skills_csv")} />
            </div>
            <div>
              <label className="block text-sm mb-1">Interests (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" {...register("interests_csv")} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">GitHub URL</label>
              <input className="w-full border rounded px-3 py-2" {...register("github_url")} />
            </div>
            <div>
              <label className="block text-sm mb-1">Colab URL</label>
              <input className="w-full border rounded px-3 py-2" {...register("colab_url")} />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded disabled:bg-indigo-300"
            >
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
