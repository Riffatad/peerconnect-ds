// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Hide navbar on login screen
  if (pathname === "/login") return null;

  const doLogout = async () => {
    await signOut(auth);
    navigate("/login", { replace: true });
  };

  const LinkBtn = ({ to, children }) => (
    <Link
      to={to}
      className="px-3 py-1 rounded hover:bg-slate-200 text-slate-700"
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <Link to="/dashboard" className="font-semibold text-indigo-700">
          PeerConnect DS
        </Link>
        <nav className="flex items-center gap-2">
          <LinkBtn to="/dashboard">Dashboard</LinkBtn>
          <LinkBtn to="/profile">Edit Profile</LinkBtn>
          <button
            onClick={doLogout}
            className="px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}
