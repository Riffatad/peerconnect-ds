
// src/pages/Onboarding.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // load existing profile
    (async () => {
      try {
        const profile = await api.findUserByEmail(user.email);
        if (profile) {
          setValue("full_name", profile.full_name);
          setValue("email", profile.email);
          setValue("headline", profile.headline || "");
          setValue("skills", (profile.skills || []).join(", "));
          setValue("interests", (profile.interests || []).join(", "));
          setValue("github_url", profile.github_url || "");
          setValue("colab_url", profile.colab_url || "");
        } else {
          setValue("email", user.email);
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    })();
  }, [user, navigate, setValue]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
        interests: values.interests.split(",").map((i) => i.trim()).filter(Boolean),
      };

      await api.createUser(payload); // or update if exists
      navigate("/dashboard");
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Unable to save profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("full_name")} placeholder="Full Name" className="border p-2 w-full" />
        <input {...register("email")} placeholder="Email" disabled className="border p-2 w-full" />
        <input {...register("headline")} placeholder="Headline" className="border p-2 w-full" />
        <input {...register("skills")} placeholder="Skills (comma separated)" className="border p-2 w-full" />
        <input {...register("interests")} placeholder="Interests (comma separated)" className="border p-2 w-full" />
        <input {...register("github_url")} placeholder="GitHub URL" className="border p-2 w-full" />
        <input {...register("colab_url")} placeholder="Colab URL" className="border p-2 w-full" />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Save changes
        </button>
      </form>
    </div>
  );
}
