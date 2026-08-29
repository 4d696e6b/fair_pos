import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fair POS",
  description: "ค้นหาและสั่งอาหารจากงานแฟร์ใกล้คุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-stone-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
