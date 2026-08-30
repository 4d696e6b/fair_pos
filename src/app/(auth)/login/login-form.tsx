"use client";

import { AuthError, login, loginWithGoogle } from "@/features/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

const SILENT_CODES = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
]);

export default function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"email" | "google" | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof AuthError && SILENT_CODES.has(error.code)) {
      setError("");
      return;
    }

    setError(
      error instanceof AuthError ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
    );
  };

  const handleEmailLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending("email");

    try {
      await login({ email, password });
      onSuccess?.();
    } catch (error) {
      handleError(error);
    } finally {
      setPending(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setPending("google");

    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (error) {
      handleError(error);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleEmailLogin} className="space-y-3 text-left">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-500">
            อีเมล
          </span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@email.com"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-stone-500">
            รหัสผ่าน
          </span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </label>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending !== null}
          className="w-full cursor-pointer rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === "email" ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        หรือ
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={pending !== null}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-400 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <GoogleIcon />
        {pending === "google" ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย Google"}
      </button>

      <p className="mt-4 text-center text-sm text-stone-500">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="font-medium text-orange-600 hover:text-orange-700"
        >
          สมัครสมาชิก
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
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
