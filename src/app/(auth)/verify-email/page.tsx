import { Suspense } from "react";
import AuthPageShell from "../components/auth-page-shell";
import VerifyEmailForm from "./verify-email-form";

export default function VerifyEmailPage() {
  return (
    <AuthPageShell title="ยืนยันอีเมล" subtitle="ยืนยันอีเมลเพื่อใช้งานบัญชีให้ครบ">
      <Suspense fallback={<p className="text-center text-sm text-stone-500">กำลังโหลด...</p>}>
        <VerifyEmailForm />
      </Suspense>
    </AuthPageShell>
  );
}
