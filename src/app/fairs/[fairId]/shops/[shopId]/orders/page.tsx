"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { getShop } from "@/lib/mock-data";
import { useOrder } from "@/lib/order-context";
import OrderStatusCard from "./components/OrderStatusCard";
import OrderSummaryCard from "./components/OrderSummaryCard";

export default function ShopOrdersPage({
  params,
}: {
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const shop = getShop(shopId);
  const { orders } = useOrder();

  const shopOrders = useMemo(
    () => orders.filter((o) => o.fairId === fairId && o.shopId === shopId),
    [orders, fairId, shopId],
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const activeOrder = useMemo(() => {
    if (shopOrders.length === 0) return undefined;
    return (
      shopOrders.find((o) => o.id === selectedOrderId) ??
      shopOrders[shopOrders.length - 1]
    );
  }, [shopOrders, selectedOrderId]);

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
        orders={shopOrders}
        onSelectOrder={setSelectedOrderId}
      />
      <OrderSummaryCard orders={shopOrders} />
    </div>
  );
}