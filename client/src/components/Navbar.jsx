// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Sign out failed:", e);
      alert("Sign out failed. See console for details.");
    }
  };

  return (
    <nav className="w-full bg-white/90 border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">PeerConnect DS</Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="text-sm underline">Profile</Link>
              <Link to="/onboarding" className="text-sm underline">Edit Profile</Link>
              <span className="text-sm text-slate-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-sm bg-slate-800 text-white px-3 py-1 rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm underline">Log in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
