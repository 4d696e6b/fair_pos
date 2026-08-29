"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronLeft, Settings, User } from "lucide-react";
import { ReactNode } from "react";

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

function HeaderActions({ showSettings }: { showSettings?: boolean }) {
  return (
    <div className="flex items-center gap-4 text-stone-600">
      <button aria-label="การแจ้งเตือน" className="transition hover:text-stone-900">
        <Bell size={20} />
      </button>
      {showSettings ? (
        <button aria-label="ตั้งค่า" className="transition hover:text-stone-900">
          <Settings size={20} />
        </button>
      ) : (
        <button aria-label="บัญชีของฉัน" className="transition hover:text-stone-900">
          <User size={20} />
        </button>
      )}
    </div>
  );
}

export default function Header(props: HeaderProps) {
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

        {/* Absolutely centered against the header, not the space between logo/actions */}
        <nav className="absolute left-1/2 top-0 flex h-16 -translate-x-1/2 items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="border-b-2 border-orange-600 pb-1 text-orange-600"
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

        <HeaderActions />
      </header>
    );
  }

  const { backHref, crumbs, tabs, showSettings } = props;
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-100 bg-white px-6">
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

      {/* Tabs centered against the header, independent of crumb/back-button width */}
      {tabs && (
        <div className="absolute left-1/2 top-0 flex h-16 -translate-x-1/2 items-center">
          {tabs}
        </div>
      )}
    </header>
  );
}