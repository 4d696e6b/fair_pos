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

export default function FlowHeader({
  backHref,
  crumbs,
  tabs,
  showSettings = false,
}: {
  backHref: string;
  crumbs: Crumb[];
  tabs?: ReactNode;
  showSettings?: boolean;
}) {
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
                      ? "truncate text-brand-600"
                      : "truncate text-stone-500 hover:text-stone-800"
                  }
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    crumb.active
                      ? "truncate text-brand-600"
                      : "truncate text-stone-800"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>

        {tabs}

        <div className="flex items-center gap-4 pl-4 text-stone-600">
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
      </div>
    </header>
  );
}
