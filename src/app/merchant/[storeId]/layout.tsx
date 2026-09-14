"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  ClipboardList,
  History,
  LayoutDashboard,
  LayoutGrid,
  Menu as MenuIcon,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { getShop } from "@/features/fairs";
import Header from "@/components/shared/Header";
import { useAuth } from "@/lib/auth-context";
import type { SellingStyle } from "@/lib/types";

type NavItem = { href: string; label: string; icon: typeof ClipboardList };
type NavGroup = { title: string; items: NavItem[] };

function getNavGroups(storeId: string, sellingStyle?: SellingStyle): NavGroup[] {
  return [
    {
      title: "การดำเนินงาน",
      items: [
        { href: `/merchant/${storeId}/orders`, label: "ออเดอร์", icon: ClipboardList },
        {
          href: `/merchant/${storeId}/tables`,
          label: sellingStyle === "takeaway" ? "จัดการออเดอร์" : "จัดการโต๊ะ",
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: "การจัดการ",
      items: [
        { href: `/merchant/${storeId}/staff`, label: "พนักงานและสิทธิ์", icon: Users },
        { href: `/merchant/${storeId}/info`, label: "ข้อมูลร้าน", icon: Store },
        { href: `/merchant/${storeId}/menu`, label: "ข้อมูลเมนู", icon: MenuIcon },
      ],
    },
    {
      title: "รายงาน",
      items: [
        { href: `/merchant/${storeId}/dashboard`, label: "แดชบอร์ด", icon: LayoutDashboard },
        { href: `/merchant/${storeId}/finance`, label: "การเงิน", icon: Wallet },
        { href: `/merchant/${storeId}/history`, label: "ประวัติคำสั่งซื้อ", icon: History },
      ],
    },
  ];
}

export default function MerchantStoreLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ storeId: string }>();
  const storeId = params.storeId;
  const { user, loading } = useAuth();
  const [storeName, setStoreName] = useState("ร้านค้า");
  const [sellingStyle, setSellingStyle] = useState<SellingStyle>("both");
  const [allowed, setAllowed] = useState(false);
  const navGroups = getNavGroups(storeId, sellingStyle);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/merchant");
      return;
    }
    void getShop(storeId).then((shop) => {
      if (!shop || shop.ownerUserId !== user.uid) {
        router.replace("/merchant");
        return;
      }
      setStoreName(shop.name);
      setSellingStyle(shop.sellingStyle ?? "both");
      setAllowed(true);
    });
  }, [storeId, user, loading, router]);

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-sm text-stone-500">
        กำลังตรวจสอบสิทธิ์ร้านค้า...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <Header
        variant="flow"
        backHref="/merchant"
        crumbs={[{ label: storeName, active: true }]}
        showSettings
      />

      <div className="flex sticky flex-1">
        <aside className="flex  w-64 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-6">
          <nav className="flex-1 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 px-2 text-xs font-semibold text-stone-400">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={
                          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition " +
                          (active
                            ? "bg-orange-700 text-white"
                            : "text-stone-600 hover:bg-stone-100")
                        }
                      >
                        <Icon size={17} />
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
