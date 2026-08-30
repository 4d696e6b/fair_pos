"use client";

import { AuthError } from "../services/errors";
import {
  completePasswordReset,
  getPasswordResetEmail,
  sendPasswordReset,
} from "../services/auth";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  if (oobCode && (mode === "resetPassword" || !mode)) {
    return <ResetPasswordForm oobCode={oobCode} />;
  }

  return <RequestResetForm />;
}

function RequestResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

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

  if (sent) {
    return (
      <div className="space-y-3 text-center text-sm text-stone-600">
        <p>ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย</p>
        <Link
          href="/login"
          className="inline-block font-medium text-orange-600 hover:text-orange-700"
        >
          กลับไปเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
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
        <Link
          href="/login"
          className="font-medium text-orange-600 hover:text-orange-700"
        >
          กลับไปเข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}

function ResetPasswordForm({ oobCode }: { oobCode: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void getPasswordResetEmail(oobCode)
      .then(setEmail)
      .catch((error) => {
        setCodeError(
          error instanceof AuthError ? error.message : "ลิงก์นี้ไม่ถูกต้อง",
        );
      });
  }, [oobCode]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setPending(true);

    try {
      await completePasswordReset(oobCode, password);
      setDone(true);
    } catch (error) {
      setError(
        error instanceof AuthError ? error.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-3 text-center text-sm text-stone-600">
        <p>ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว</p>
        <Link
          href="/login"
          className="inline-block font-medium text-orange-600 hover:text-orange-700"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  if (codeError) {
    return (
      <div className="space-y-3 text-center text-sm">
        <p className="rounded-lg bg-red-50 px-3 py-2 text-red-600">{codeError}</p>
        <Link
          href="/forgot-password"
          className="inline-block font-medium text-orange-600 hover:text-orange-700"
        >
          ขอลิงก์ใหม่
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3 text-left">
      {email ? (
        <p className="text-sm text-stone-500">
          กำลังตั้งรหัสผ่านใหม่สำหรับ <span className="font-medium text-stone-800">{email}</span>
        </p>
      ) : null}

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-500">
          รหัสผ่านใหม่
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-stone-500">
          ยืนยันรหัสผ่านใหม่
        </span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
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
        {pending ? "กำลังบันทึก..." : "ตั้งรหัสผ่านใหม่"}
      </button>
    </form>
  );
}
