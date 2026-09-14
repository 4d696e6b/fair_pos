"use client";

import {
  AuthError,
  completeEmailVerification,
  sendVerificationEmail,
  useAuth,
} from "@/features/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const { firebaseUser, loading } = useAuth();
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">(
    oobCode ? "verifying" : "idle",
  );
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      return;
    }

    void completeEmailVerification(oobCode)
      .then(() => {
        setStatus("verified");
        setMessage("ยืนยันอีเมลเรียบร้อยแล้ว");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof AuthError ? error.message : "ไม่สามารถยืนยันอีเมลได้",
        );
      });
  }, [oobCode]);

  const handleResend = async () => {
    setMessage("");
    setSending(true);

    try {
      await sendVerificationEmail();
      setMessage("ส่งอีเมลยืนยันอีกครั้งแล้ว กรุณาตรวจสอบกล่องจดหมาย");
    } catch (error) {
      setMessage(
        error instanceof AuthError ? error.message : "ไม่สามารถส่งอีเมลยืนยันได้",
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <p className="text-center text-sm text-stone-500">กำลังโหลด...</p>;
  }

  return (
    <div className="space-y-4 text-center text-sm text-stone-600">
      {status === "verifying" ? <p>กำลังยืนยันอีเมล...</p> : null}

      {message ? (
        <p
          className={
            status === "error"
              ? "rounded-lg bg-red-50 px-3 py-2 text-red-600"
              : "rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700"
          }
        >
          {message}
        </p>
      ) : null}

      {!oobCode && firebaseUser && !firebaseUser.emailVerified ? (
        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="w-full cursor-pointer rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "กำลังส่ง..." : "ส่งอีเมลยืนยันอีกครั้ง"}
        </button>
      ) : null}

      {!firebaseUser && !oobCode ? (
        <p>
          กรุณา{" "}
          <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">
            เข้าสู่ระบบ
          </Link>{" "}
          เพื่อส่งอีเมลยืนยัน
        </p>
      ) : null}

      <Link
        href="/"
        className="inline-block font-medium text-orange-600 hover:text-orange-700"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
