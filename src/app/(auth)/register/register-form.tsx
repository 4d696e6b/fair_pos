"use client";

import { AuthError, register } from "@/features/auth";
import Link from "next/link";
import { FormEvent, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setPending(true);

    try {
      await register({ username, email, password });
      onSuccess?.();
    } catch (error) {
      setError(
        error instanceof AuthError ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-500">
          ชื่อผู้ใช้
        </span>
        <input
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
          placeholder="ชื่อที่แสดงในระบบ"
        />
      </label>

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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="อย่างน้อย 6 ตัวอักษร"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-500">
          ยืนยันรหัสผ่าน
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
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
        {pending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
      </button>

      <p className="pt-1 text-center text-sm text-stone-500">
        มีบัญชีอยู่แล้ว?{" "}
        <Link
          href="/login"
          className="font-medium text-orange-600 hover:text-orange-700"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
