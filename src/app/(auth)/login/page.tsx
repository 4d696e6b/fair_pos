"use client";

import { useRouter } from "next/navigation";
import AuthPageShell from "@/features/auth/components/auth-page-shell";
import LoginForm from "@/features/auth/components/login-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <AuthPageShell title="เข้าสู่ระบบ" subtitle="ยินดีต้อนรับกลับสู่ Fair POS">
      <LoginForm
        onSuccess={() => {
          router.push("/");
          router.refresh();
        }}
      />
    </AuthPageShell>
  );
}
