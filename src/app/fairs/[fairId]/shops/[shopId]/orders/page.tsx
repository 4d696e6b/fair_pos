"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getShop } from "@/features/fairs";
import { listOrdersForShopCustomer } from "@/features/orders";
import OrderStatusCard from "./components/OrderStatusCard";
import OrderSummaryCard from "./components/OrderSummaryCard";
import type { Order, Shop } from "@/lib/types";

function customerStatus(status: Order["status"]) {
  if (status === "ready" || status === "completed") return "ready" as const;
  if (status === "preparing") return "preparing" as const;
  return "received" as const;
}

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
      <OrderStatusCard
        order={activeOrder}
        shopName={shop?.name}
        boothNumber={shop?.boothNumber}
        orders={displayOrders}
        onSelectOrder={setSelectedOrderId}
      />
      <OrderSummaryCard orders={displayOrders} />
    </div>
  );
}
