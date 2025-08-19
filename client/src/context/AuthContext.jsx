

import { createContext, useContext, useEffect, useState } from "react";
//  get the *instance* from our lib file
import { auth } from "../lib/firebase";
// import only the functions from firebase/auth
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setReady(true);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {ready ? children : <div className="p-6">Loading…</div>}
    </AuthContext.Provider>
  );
}
