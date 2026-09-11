"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/shared/Header";
import { getShop } from "@/features/fairs";
import { listOrdersForUser } from "@/features/orders";
import { useAuth } from "@/lib/auth-context";
import type { Order, Shop } from "@/lib/types";

const STATUS_LABEL: Record<Order["status"], string> = {
  received: "รับออเดอร์แล้ว",
  preparing: "กำลังปรุง",
  ready: "พร้อมรับแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ถูกยกเลิก",
};

export default function HistoryPage() {
  const { user, loading: authLoading, openLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [shops, setShops] = useState<Record<string, Shop>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void listOrdersForUser(user.uid).then(async (next) => {
      setOrders(next);
      const uniqueShopIds = [...new Set(next.map((order) => order.shopId))];
      const entries = await Promise.all(
        uniqueShopIds.map(async (shopId) => {
          const shop = await getShop(shopId);
          return shop ? ([shopId, shop] as const) : null;
        }),
      );
      setShops(
        Object.fromEntries(entries.filter((entry): entry is readonly [string, Shop] => Boolean(entry))),
      );
      setLoading(false);
    });
  }, [authLoading, user]);

  return (
    <div>
      <Header variant="site" />
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-xl font-bold text-stone-900">ประวัติการสั่งซื้อ</h1>
        {authLoading || loading ? (
          <p className="mt-4 text-center text-sm text-stone-400">กำลังโหลดประวัติ...</p>
        ) : !user ? (
          <p className="mt-4 text-center text-sm text-stone-400">
            <button onClick={openLogin} className="font-medium text-orange-600">
              เข้าสู่ระบบ
            </button>{" "}
            เพื่อดูประวัติการสั่งซื้อ
          </p>
        ) : orders.length === 0 ? (
          <p className="mt-4 text-center text-sm text-stone-400">
            ยังไม่มีประวัติการสั่งซื้อ เริ่มค้นหางานแฟร์เพื่อสั่งอาหารได้เลย
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {orders.map((order) => {
              const shop = shops[order.shopId];
              const itemPreview = order.lines
                .slice(0, 3)
                .map((line) => `${line.qty}x ${line.item.name}`)
                .join(" · ");
              const extraCount = order.lines.length - 3;
              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-stone-800">
                        {shop?.name ?? "ร้านค้า"}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {shop?.boothNumber ? `บูธ ${shop.boothNumber} · ` : ""}
                        {order.refCode} · คิว {order.queueNumber}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-orange-700">
                      ฿{order.total.toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    {itemPreview}
                    {extraCount > 0 ? ` และอีก ${extraCount} รายการ` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                    <span>
                      {order.type === "dine-in" ? "ทานที่ร้าน" : "รับกลับบ้าน"}
                      {order.tableLabel ? ` · ${order.tableLabel}` : ""}
                      {" · "}
                      {new Date(order.createdAt).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                    <span className="font-medium text-stone-500">{STATUS_LABEL[order.status]}</span>
                  </div>
                  {order.fairId ? (
                    <Link
                      href={`/fairs/${order.fairId}/shops/${order.shopId}/orders`}
                      className="mt-3 inline-block text-xs font-medium text-orange-600 hover:text-orange-700"
                    >
                      ดูสถานะออเดอร์
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
