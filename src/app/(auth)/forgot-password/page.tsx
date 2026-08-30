import { Suspense } from "react";
import AuthPageShell from "../components/auth-page-shell";
import ForgotPasswordForm from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="ลืมรหัสผ่าน"
      subtitle="กรอกอีเมลเพื่อรับลิงก์ตั้งรหัสผ่านใหม่"
    >
      <Suspense fallback={<p className="text-center text-sm text-stone-500">กำลังโหลด...</p>}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthPageShell>
  );
}
