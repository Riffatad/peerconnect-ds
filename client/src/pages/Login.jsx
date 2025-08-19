// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { findUserByEmail } from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // If already logged in, decide where to go
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setChecking(false);
        return;
      }
      try {
        const existing = await findUserByEmail(u.email);
        navigate(existing ? "/dashboard" : "/onboarding", { replace: true });
      } catch {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const u = auth.currentUser;
      const existing = u ? await findUserByEmail(u.email) : null;
      navigate(existing ? "/dashboard" : "/onboarding", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console for details.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Checking session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">PeerConnect DS</h1>
        <p className="text-center text-slate-600 mb-6">Sign in to continue</p>
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
