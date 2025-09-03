// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import app from "../lib/firebase";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const AuthCtx = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  return useContext(AuthCtx);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading true until we know

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = { user, loading, signInWithGoogle, signOutUser, auth };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
