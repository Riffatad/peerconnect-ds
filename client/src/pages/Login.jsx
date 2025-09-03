// src/pages/Login.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Google sign-in failed:", e);
      alert("Sign-in failed. See console for details.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white shadow rounded p-6">
          <h1 className="text-xl font-semibold mb-4 text-center">Sign in</h1>
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full rounded bg-indigo-600 text-white py-2 hover:bg-indigo-700"
          >
            {loading ? "Loading…" : "Continue with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
