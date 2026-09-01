import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import LoginModal from "@/components/shared/LoginModal";
import RegisterModal from "@/components/shared/RegisterModal";
import ForgotPasswordModal from "@/components/shared/ForgotPasswordModal";

export const metadata: Metadata = {
  title: "Fair POS",
  icons: {
    icon: '/logo_simple.png', 
  },
  description: "ค้นหาและสั่งอาหารจากงานแฟร์ใกล้คุณ",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-stone-50 font-sans antialiased">
        <AuthProvider>
          {children}
          <LoginModal />
          <RegisterModal />
          <ForgotPasswordModal />
        </AuthProvider>
      </body>
    </html>
  );
}