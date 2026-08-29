import Link from "next/link";
import { Bell, User } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-100 bg-white px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl">🏮</span>
        <span className="text-lg font-bold text-stone-900">Fair POS</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/"
          className="border-b-2 border-brand-600 pb-1 text-brand-600"
        >
          หน้าหลัก
        </Link>
        <Link
          href="/history"
          className="pb-1 text-stone-500 transition hover:text-stone-800"
        >
          ประวัติ
        </Link>
      </nav>

      <div className="flex items-center gap-4 text-stone-600">
        <button aria-label="การแจ้งเตือน" className="transition hover:text-stone-900">
          <Bell size={20} />
        </button>
        <button aria-label="บัญชีของฉัน" className="transition hover:text-stone-900">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
