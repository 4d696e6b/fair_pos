"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronLeft, Settings, User } from "lucide-react";
import { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

type Crumb = {
  label: string;
  href?: string;
  active?: boolean;
};

type HeaderProps =
  | { variant: "site" }
  | {
      variant: "flow";
      backHref: string;
      crumbs: Crumb[];
      tabs?: ReactNode;
      showSettings?: boolean;
    };

// account intentionally excluded — it's represented by the icon in HeaderActions, not a text link
const SITE_NAV = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/history", label: "ประวัติ" },
];

function HeaderActions({ showSettings }: { showSettings?: boolean }) {
  const pathname = usePathname();
  const { user, openLogin } = useAuth();
  const isAccountActive = pathname === "/account";

  return (
    <div className="flex items-center gap-4 text-stone-600">
      <button aria-label="การแจ้งเตือน" className="transition hover:text-stone-900">
        <Bell size={20} />
      </button>

      {showSettings ? (
        <button aria-label="ตั้งค่า" className="transition hover:text-stone-900">
          <Settings size={20} />
        </button>
      ) : user ? (
        <Link
          href="/account"
          aria-label="บัญชีของฉัน"
          className={
            "cursor-pointer transition " +
            (isAccountActive ? "text-orange-600" : "hover:text-stone-900")
          }
        >
          <User size={20} />
        </Link>
      ) : (
        <button
          onClick={openLogin}
          aria-label="เข้าสู่ระบบ"
          className="cursor-pointer transition hover:text-stone-900"
        >
          <User size={20} />
        </button>
      )}
    </div>
  );
}

export default function Header(props: HeaderProps) {
  const pathname = usePathname();

  if (props.variant === "site") {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-100 bg-white px-6">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            className="flex h-16 w-16 items-center justify-center object-cover"
          />
          <span className="text-xl font-bold text-orange-600">Fair POS</span>
        </Link>

        <nav className="absolute left-1/2 top-0 flex h-16 -translate-x-1/2 items-center gap-6 text-sm font-medium">
          {SITE_NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? "border-b-2 border-orange-600 pb-1 text-orange-600"
                    : "border-b-2 border-transparent pb-1 text-stone-500 transition hover:text-stone-800"
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <HeaderActions />
      </header>
    );
  }

  const { backHref, crumbs, tabs, showSettings } = props;
  const router = useRouter();

  return (
    <header className="relative sticky top-0 z-30 border-b border-stone-100 bg-white px-6">
      <div className="flex h-16 items-center gap-2 text-sm">
        <button
          onClick={() => router.push(backHref)}
          className="flex items-center gap-1 pr-3 font-medium text-stone-500 transition hover:text-stone-800"
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div className="flex flex-1 items-center gap-2 truncate font-medium">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2 truncate">
              {i > 0 && <span className="text-stone-300">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className={
                    crumb.active
                      ? "truncate text-orange-600"
                      : "truncate text-stone-500 hover:text-stone-800"
                  }
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    crumb.active
                      ? "truncate text-orange-600"
                      : "truncate text-stone-800"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>

        <div className="pl-4">
          <HeaderActions showSettings={showSettings} />
        </div>
      </div>

      {tabs && (
        <div className="absolute left-1/2 top-0 flex h-16 -translate-x-1/2 items-center">
          {tabs}
        </div>
      )}
    </header>
  );
}