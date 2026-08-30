"use client";

import { useRouter } from "next/navigation";
import AuthPageShell from "@/features/auth/components/auth-page-shell";
import RegisterForm from "@/features/auth/components/register-form";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthPageShell
      title="สมัครสมาชิก"
      subtitle="สร้างบัญชีเพื่อบันทึกออเดอร์ของคุณ"
    >
      <RegisterForm
        onSuccess={() => {
          router.push("/verify-email");
        }}
      />
    </AuthPageShell>
  );
}
