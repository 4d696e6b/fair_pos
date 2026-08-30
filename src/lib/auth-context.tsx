"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { usePathname } from "next/navigation";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoginOpen(false);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      if (nextUser) {
        setLoginOpen(false);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoginOpen,
        openLogin: () => setLoginOpen(true),
        closeLogin: () => setLoginOpen(false),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
