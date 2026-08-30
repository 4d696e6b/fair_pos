"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/shared/Header";
import ProfileSidebar from "./components/ProfileSidebar";
import PersonalInfoCard, { PersonalInfo } from "./components/PersonalInfoCard";
import NotificationsCard, { NotificationPrefs } from "./components/NotificationsCard";
import { useAuth } from "@/lib/auth-context";

export default function AccountPage() {
  const { user, loading, openLogin } = useAuth();
  const router = useRouter();
  const [info, setInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    email: true,
    salesSummary: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      openLogin();
      router.replace("/");
    }
  }, [loading, user, openLogin, router]);

  if (loading || !user) {
    return (
      <div>
        <Header variant="site" />
        <p className="px-6 py-10 text-center text-sm text-stone-500">กำลังโหลดบัญชี...</p>
      </div>
    );
  }

  const email = user.email ?? "";
  const displayName = user.displayName?.trim() || email.split("@")[0] || "ผู้ใช้";
  const fullName = `${info.firstName} ${info.lastName}`.trim() || displayName;

  return (
    <div>
      <Header variant="site" />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ProfileSidebar
            name={fullName}
            email={email}
            avatarUrl={user.photoURL ?? undefined}
            onSwitchToMerchant={() => {}}
          />

          <div className="space-y-6">
            <PersonalInfoCard info={info} onChange={setInfo} />
            <NotificationsCard prefs={prefs} onChange={setPrefs} />

            <div className="flex justify-end gap-3">
              <button className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium text-stone-500 transition hover:text-stone-800">
                ยกเลิก
              </button>
              <button className="cursor-pointer rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800">
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
