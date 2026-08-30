"use client";

import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthError, sendPasswordReset } from "@/features/auth";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function ForgotPasswordModal() {
  const { authModal, closeAuthModal, openLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  if (authModal !== "forgot-password") return null;

  const reset = () => {
    setEmail("");
    setError("");
    setSent(false);
  };

  const handleClose = () => {
    closeAuthModal();
    reset();
  };

  const handleBackToLogin = () => {
    openLogin();
    reset();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (error) {
      setError(
        error instanceof AuthError ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-xl"
      >
        <button
          onClick={handleClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-orange-600">ลืมรหัสผ่าน</h2>
        <p className="mt-1 text-sm text-stone-400">
          กรอกอีเมลเพื่อรับลิงก์ตั้งรหัสผ่านใหม่
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        {sent ? (
          <div className="space-y-3 text-sm text-stone-600">
            <p>ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย</p>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="cursor-pointer font-medium text-orange-600 hover:text-orange-700"
            >
              กลับไปเข้าสู่ระบบ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
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

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="w-full cursor-pointer rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "กำลังส่งลิงก์..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
            </button>

            <p className="pt-1 text-center text-sm text-stone-500">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="cursor-pointer font-medium text-orange-600 hover:text-orange-700"
              >
                กลับไปเข้าสู่ระบบ
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
