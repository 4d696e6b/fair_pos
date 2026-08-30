"use client";

import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginModal() {
  const { isLoginOpen, closeLogin, signInWithGoogle } = useAuth();

  if (!isLoginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeLogin}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center flex flex-col justify-center items-center shadow-xl"
      >
        <button
          onClick={closeLogin}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

      
        <img
          src="/logo.png"
          alt="logo"
          className="flex h-40 w-40 items-center justify-center object-cover"
        />

        <h2 className="text-xl font-bold text-orange-600">Fair POS</h2>
        <p className="mt-1 text-sm text-stone-400">
          ค้นหาและสั่งอาหารจากงานแฟร์ใกล้คุณ
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <p className="mb-4 text-sm text-stone-500">
          เข้าสู่ระบบเพื่อบันทึกออเดอร์ของคุณ
        </p>

        <button
          onClick={signInWithGoogle}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-400 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
        >
          <GoogleIcon />
          เข้าสู่ระบบด้วย Google
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.9 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.9 39.8 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.5 5.4C40.9 36.4 44 30.7 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}