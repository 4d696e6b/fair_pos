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

const MERCHANT_MODE_KEY = "fair-pos-merchant-mode";

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
    setMerchantMode(window.localStorage.getItem(MERCHANT_MODE_KEY) === "1");
  }, []);

  useEffect(() => {
    setAuthModal(null);
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      if (nextUser) {
        setAuthModal(null);
      } else {
        setMerchantMode(false);
        window.localStorage.removeItem(MERCHANT_MODE_KEY);
      }
    });
    return unsubscribe;
  }, []);

  const signOut = () => {
    setMerchantMode(false);
    window.localStorage.removeItem(MERCHANT_MODE_KEY);
    return firebaseSignOut(auth);
  };

  const toggleMerchantMode = () => {
    setMerchantMode((prev) => {
      const next = !prev;
      window.localStorage.setItem(MERCHANT_MODE_KEY, next ? "1" : "0");
      return next;
    });
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
        toggleMerchantMode,
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
