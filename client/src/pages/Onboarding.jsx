// src/pages/Onboarding.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUser, findUserByEmail } from "../lib/api";

export default function Onboarding() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      headline: "",
      skills_csv: "",
      interests_csv: "",
      github_url: "",
      colab_url: "",
    },
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }
      // prefill email from Firebase user
      setValue("email", u.email || "");

      try {
        const existing = await findUserByEmail(u.email);
        if (existing) setHasProfile(true);
      } finally {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [navigate, setValue]);

  const csv = (s) =>
    (s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

  const onSubmit = async (values) => {
    const payload = {
      full_name: values.full_name || "",
      email: values.email || "",
      headline: values.headline || null,
      skills: csv(values.skills_csv),
      interests: csv(values.interests_csv),
      github_url: values.github_url || null,
      colab_url: values.colab_url || null,
    };
    try {
      await createUser(payload);
      navigate("/dashboard");
    } catch (e) {
      console.error("Create user error:", e);
      alert("Unable to save profile. Make sure the backend is running.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading…</div>
      </div>
    );
  }

  if (hasProfile) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg text-center">
        <h1 className="text-xl font-semibold mb-2">Profile already exists</h1>
        <p className="text-slate-600 mb-6">
          You can go to your dashboard or edit your profile.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium py-2 px-4 rounded"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}


  // Show onboarding form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
        <h1 className="text-xl font-semibold mb-1">Create your profile</h1>
        <p className="text-sm text-slate-600 mb-4">
          This helps us match you with peers.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <label className="block text-sm mb-1">Full Name *</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...register("full_name", { required: true })}
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email *</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              {...register("email", { required: true })}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Headline</label>
            <input
              className="w-full border rounded px-3 py-2"
              {...register("headline")}
              placeholder="Aspiring DS • Learning NLP"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Skills (comma separated)</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("skills_csv")}
                placeholder="python, sql, pandas"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Interests (comma separated)</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("interests_csv")}
                placeholder="nlp, viz"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">GitHub URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("github_url")}
                placeholder="https://github.com/yourname"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Colab URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                {...register("colab_url")}
                placeholder="https://colab.research.google.com/..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded disabled:bg-indigo-300"
            >
              {isSubmitting ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
