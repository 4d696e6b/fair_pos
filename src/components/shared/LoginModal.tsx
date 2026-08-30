"use client";

import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import LoginForm from "@/app/(auth)/login/login-form";
import { useRouter } from "next/navigation";

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuth();
  const router = useRouter();

  if (!isLoginOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeLogin}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-xl"
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
          className="mx-auto h-28 w-28 object-cover"
        />

        <h2 className="text-xl font-bold text-orange-600">Fair POS</h2>
        <p className="mt-1 text-sm text-stone-400">
          ค้นหาและสั่งอาหารจากงานแฟร์ใกล้คุณ
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <p className="mb-4 text-sm text-stone-500">
          เข้าสู่ระบบเพื่อบันทึกออเดอร์ของคุณ
        </p>

        <LoginForm
          onSuccess={() => {
            closeLogin();
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
