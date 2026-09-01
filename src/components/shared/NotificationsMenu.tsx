"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { listShopsByOwner } from "@/features/fairs";
import { isOpenKitchenStatus, listOrdersForShop, listOrdersForUser } from "@/features/orders";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/lib/types";

type Notice = {
  id: string;
  title: string;
  detail: string;
  href: string;
};

const STATUS_LABEL: Record<Order["status"], string> = {
  received: "รับออเดอร์แล้ว",
  preparing: "กำลังปรุง",
  ready: "พร้อมรับแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ถูกยกเลิก",
};

export default function NotificationsMenu() {
  const { user, merchantMode, openLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;

    const load = async () => {
      if (merchantMode) {
        const shops = await listShopsByOwner(user.uid);
        const batches = await Promise.all(shops.slice(0, 5).map((shop) => listOrdersForShop(shop.id)));
        const items: Notice[] = [];
        shops.forEach((shop, index) => {
          batches[index]
            .filter((order) => isOpenKitchenStatus(order.status))
            .slice(0, 4)
            .forEach((order) => {
              items.push({
                id: order.id,
                title: `${shop.name} · คิว ${order.queueNumber}`,
                detail: STATUS_LABEL[order.status],
                href: `/merchant/${shop.id}/orders`,
              });
            });
        });
        if (!cancelled) setNotices(items.slice(0, 8));
        return;
      }

      const orders = await listOrdersForUser(user.uid);
      if (!cancelled) {
        setNotices(
          orders.slice(0, 8).map((order) => ({
            id: order.id,
            title: `คิว ${order.queueNumber}`,
            detail: STATUS_LABEL[order.status],
            href: `/fairs/${order.fairId}/shops/${order.shopId}/orders`,
          })),
        );
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, user, merchantMode]);

  return (
    <div className="relative">
      <button
        aria-label="การแจ้งเตือน"
        onClick={() => {
          if (!user) {
            openLogin();
            return;
          }
          setOpen((value) => !value);
        }}
        className="transition hover:text-stone-900"
      >
        <Bell size={20} />
      </button>
      {open ? (
        <div className="absolute right-0 top-8 z-40 w-72 rounded-2xl border border-stone-100 bg-white p-3 shadow-lg">
          <p className="mb-2 px-1 text-xs font-semibold text-stone-400">การแจ้งเตือน</p>
          {notices.length === 0 ? (
            <p className="px-1 py-6 text-center text-sm text-stone-400">ยังไม่มีการแจ้งเตือน</p>
          ) : (
            <ul className="space-y-1">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <Link
                    href={notice.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 hover:bg-stone-50"
                  >
                    <p className="text-sm font-medium text-stone-800">{notice.title}</p>
                    <p className="text-xs text-stone-400">{notice.detail}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
