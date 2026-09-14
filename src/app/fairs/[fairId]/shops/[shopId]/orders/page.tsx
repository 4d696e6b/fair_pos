"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getShop } from "@/features/fairs";
import { createNudgeNotification } from "@/features/notifications";
import { listOrdersForShopCustomer, markOrderNudged } from "@/features/orders";
import OrderStatusCard from "./components/OrderStatusCard";
import OrderSummaryCard from "./components/OrderSummaryCard";
import type { Order, Shop } from "@/lib/types";

function customerStatus(status: Order["status"]) {
  if (status === "ready" || status === "completed") return "ready" as const;
  if (status === "preparing") return "preparing" as const;
  return "received" as const;
}

const NUDGE_COOLDOWN_MS = 5 * 60 * 1000;

export default function ShopOrdersPage({
  params,
}: {
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopOrders, setShopOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [nudging, setNudging] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState("");

  useEffect(() => {
    void Promise.all([getShop(shopId), listOrdersForShopCustomer(shopId, fairId)]).then(
      ([nextShop, nextOrders]) => {
        setShop(nextShop);
        setShopOrders(nextOrders);
        setLoading(false);
      },
    );
  }, [fairId, shopId]);

  const displayOrders = shopOrders.map((order) => ({
    ...order,
    status: customerStatus(order.status),
  }));

  const activeOrder = useMemo(() => {
    if (displayOrders.length === 0) return undefined;
    return (
      displayOrders.find((o) => o.id === selectedOrderId) ??
      displayOrders[displayOrders.length - 1]
    );
  }, [displayOrders, selectedOrderId]);

  const rawActive = shopOrders.find((order) => order.id === activeOrder?.id);
  const canNudge =
    Boolean(shop?.ownerUserId && rawActive) &&
    rawActive?.status !== "completed" &&
    rawActive?.status !== "cancelled" &&
    rawActive?.status !== "ready";

  const handleNudge = async () => {
    if (!shop?.ownerUserId || !rawActive) return;
    const lastNudge = rawActive.nudgedAt ? new Date(rawActive.nudgedAt).getTime() : 0;
    if (Date.now() - lastNudge < NUDGE_COOLDOWN_MS) {
      setNudgeMessage("เพิ่งทวงออเดอร์ไปแล้ว กรุณารอสักครู่");
      return;
    }
    setNudging(true);
    setNudgeMessage("");
    try {
      await createNudgeNotification({
        userId: shop.ownerUserId,
        shopId,
        orderId: rawActive.id,
        queueNumber: rawActive.queueNumber,
      });
      await markOrderNudged(rawActive.id);
      setShopOrders((prev) =>
        prev.map((order) =>
          order.id === rawActive.id ? { ...order, nudgedAt: new Date().toISOString() } : order,
        ),
      );
      setNudgeMessage("ส่งการทวงออเดอร์ไปยังร้านค้าแล้ว");
    } catch {
      setNudgeMessage("ทวงออเดอร์ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setNudging(false);
    }
  };

  if (loading) {
    return (
      <p className="px-6 py-20 text-center text-sm text-stone-500">กำลังโหลดออเดอร์...</p>
    );
  }

  if (!activeOrder) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-stone-500">คุณยังไม่มีออเดอร์ที่กำลังดำเนินการ</p>
        <Link
          href={`/fairs/${fairId}/shops/${shopId}`}
          className="mt-4 inline-block rounded-full bg-orange-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-800"
        >
          ไปที่เมนูอาหาร
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 sm:grid-cols-2">
      <div className="space-y-4">
        <OrderStatusCard
          order={activeOrder}
          shopName={shop?.name}
          boothNumber={shop?.boothNumber}
          orders={displayOrders}
          onSelectOrder={setSelectedOrderId}
        />
        {canNudge ? (
          <div className="rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
            <button
              type="button"
              onClick={() => void handleNudge()}
              disabled={nudging}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:opacity-60"
            >
              <Bell size={16} />
              {nudging ? "กำลังทวงออเดอร์..." : "ทวงออเดอร์"}
            </button>
            {nudgeMessage ? (
              <p className="mt-2 text-center text-xs text-stone-500">{nudgeMessage}</p>
            ) : (
              <p className="mt-2 text-center text-xs text-stone-400">
                แจ้งร้านค้าหากออเดอร์ล่าช้าหรือถูกลืม
              </p>
            )}
          </div>
        ) : null}
      </div>
      <OrderSummaryCard
        orders={displayOrders}
        taxRate={shop?.taxRate ?? 0}
        serviceChargeRate={shop?.serviceCharge ?? 0}
      />
    </div>
  );
}
