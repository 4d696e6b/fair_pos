"use client";

import { FormEvent, useState } from "react";
import { Shield } from "lucide-react";
import { AuthError, changeEmail, changePassword, deleteAccount } from "@/features/auth";

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 outline-none transition focus:border-orange-400 focus:bg-white";

export default function SecurityCard({ onDeleted }: { onDeleted: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"password" | "email" | "delete" | null>(null);

  const run = async (kind: "password" | "email" | "delete", action: () => Promise<void>) => {
    setPending(kind);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (caught) {
      setError(caught instanceof AuthError ? caught.message : "ดำเนินการไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setPending(null);
    }
  };

  const handlePassword = (event: FormEvent) => {
    event.preventDefault();
    void run("password", async () => {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("เปลี่ยนรหัสผ่านแล้ว");
    });
  };

  const handleEmail = (event: FormEvent) => {
    event.preventDefault();
    void run("email", async () => {
      await changeEmail({ currentPassword, newEmail });
      setNewEmail("");
      setMessage("ส่งอีเมลยืนยันที่อยู่อีเมลใหม่แล้ว");
    });
  };

  const handleDelete = () => {
    if (!window.confirm("ลบบัญชีนี้ถาวร?")) return;
    void run("delete", async () => {
      await deleteAccount(currentPassword);
      onDeleted();
    });
  };

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-4">
        <Shield size={18} className="text-orange-700" />
        <h2 className="font-bold text-stone-900">ความปลอดภัยบัญชี</h2>
      </div>

      {message ? <p className="mb-3 text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <form onSubmit={handlePassword} className="space-y-3">
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="รหัสผ่านปัจจุบัน"
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="รหัสผ่านใหม่"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending !== null}
          className="rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending === "password" ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
        </button>
      </form>

      <form onSubmit={handleEmail} className="mt-6 space-y-3 border-t border-stone-100 pt-4">
        <input
          type="email"
          required
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="อีเมลใหม่"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={pending !== null}
          className="rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:opacity-60"
        >
          {pending === "email" ? "กำลังส่ง..." : "เปลี่ยนอีเมล"}
        </button>
      </form>

      <div className="mt-6 border-t border-stone-100 pt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending !== null || !currentPassword}
          className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending === "delete" ? "กำลังลบ..." : "ลบบัญชี"}
        </button>
        <p className="mt-2 text-xs text-stone-400">กรอกรหัสผ่านปัจจุบันด้านบนแล้วกดลบบัญชี</p>
      </div>
    </div>
  );
}
