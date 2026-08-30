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

type AuthModal = "login" | "register" | "forgot-password" | null;

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authModal: AuthModal;
  openLogin: () => void;
  openRegister: () => void;
  openForgotPassword: () => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
  merchantMode: boolean;
  toggleMerchantMode: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [merchantMode, setMerchantMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAuthModal(null);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      if (nextUser) {
        setAuthModal(null);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = () => {
    setMerchantMode(false);
    return firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authModal,
        openLogin: () => setAuthModal("login"),
        openRegister: () => setAuthModal("register"),
        openForgotPassword: () => setAuthModal("forgot-password"),
        closeAuthModal: () => setAuthModal(null),
        signOut,
        merchantMode,
        toggleMerchantMode: () => setMerchantMode((prev) => !prev),
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