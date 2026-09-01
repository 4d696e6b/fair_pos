"use client";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import { listOrdersForUser } from "@/features/orders";
import { useAuth } from "@/lib/auth-context";
import type { Order } from "@/lib/types";

export default function HistoryPage() {
  const { user, loading: authLoading, openLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void listOrdersForUser(user.uid).then((next) => {
      setOrders(next);
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
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-stone-800">{order.refCode}</p>
                  <p className="text-sm font-semibold text-orange-700">
                    ฿{order.total.toFixed(2)}
                  </p>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  คิว {order.queueNumber} • {order.createdAt} • {order.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
