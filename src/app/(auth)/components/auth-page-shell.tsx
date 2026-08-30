"use client";

import Header from "@/components/shared/Header";

export default function AuthPageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header variant="site" />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 shadow-xl">
          <h1 className="text-center text-xl font-bold text-orange-600">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-center text-sm text-stone-400">{subtitle}</p>
          ) : null}
          <div className="mx-auto my-5 h-px w-16 bg-orange-400" />
          {children}
        </div>
      </div>
    </div>
  );
}
