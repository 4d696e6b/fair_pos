"use client";

import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import RegisterForm from "@/app/(auth)/register/register-form";
import { useRouter } from "next/navigation";

export default function RegisterModal() {
  const { authModal, closeAuthModal } = useAuth();
  const router = useRouter();

  if (authModal !== "register") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeAuthModal}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-xl animate-popUp"
      >
        <button
          onClick={closeAuthModal}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-orange-600">สมัครสมาชิก</h2>
        <p className="mt-1 text-sm text-stone-400">
          สร้างบัญชีเพื่อบันทึกออเดอร์ของคุณ
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <RegisterForm
          onSuccess={() => {
            closeAuthModal();
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
