"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Pencil, Store, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProfileSidebar({
  name,
  email,
  avatarUrl,
  merchantMode,
  onSwitchToMerchant,
}: {
  name: string;
  email: string;
  avatarUrl?: string;
  merchantMode: boolean;
  onSwitchToMerchant: () => void;
}) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-5">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm gap-4 flex flex-col">
            <div className="relative mx-auto mb-4 h-24 w-24">
            <div className="h-24 w-24 overflow-hidden rounded-full bg-stone-100">
                <img src={avatarUrl || "/default-avatar.jpg"} alt={name} className="h-full w-full object-cover" />
            </div>
            <button
                aria-label="เปลี่ยนรูปโปรไฟล์"
                className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-orange-700 text-white shadow transition hover:bg-orange-800"
            >
                <Pencil size={12} />
            </button>
            </div>
            <p className="font-bold text-stone-900">{name}</p>
            <p className="text-sm text-stone-400">{email}</p>
            <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
            >
            <LogOut size={16} />
            {signingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
            </button>
        </div>

      <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
        <p className="mb-3 text-xs font-medium text-stone-400">จัดการบัญชี</p>
        <button
          onClick={onSwitchToMerchant}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
        >
          {merchantMode ? <User size={16} /> : <Store size={16} />}
          {merchantMode ? "กลับสู่โหมดปกติ" : "สลับไปยังโหมดร้านค้า"}
        </button>
      </div>
    </div>
  );
}