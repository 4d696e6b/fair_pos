"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderCard, { KitchenOrder, OrderStatus } from "./components/OrderCard";
import OrderConfirmModal, { OrderConfirmAction } from "./components/OrderConfirmModal";
import { listenOrdersForShop, updateOrderStatus } from "@/features/orders";
import type { Order } from "@/lib/types";

function toKitchen(order: Order): KitchenOrder {
  const kitchenStatus: OrderStatus =
    order.status === "cancelled"
      ? "cancelled"
      : order.status === "completed" || order.status === "ready"
        ? "completed"
        : "pending";

  return {
    id: order.id,
    refCode: order.refCode,
    table: order.tableLabel ?? (order.type === "takeaway" ? "สั่งกลับบ้าน" : "หน้าร้าน"),
    queue: order.queueNumber,
    type: order.type,
    createdAt: order.createdAt,
    status: kitchenStatus,
    items: order.lines.map((line) => ({
      qty: line.qty,
      name: line.item.name,
      note: line.note,
      done: kitchenStatus === "completed",
    })),
  };
}

export default function OrdersPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [tab, setTab] = useState<OrderStatus>("pending");
  const [allOrders, setAllOrders] = useState<KitchenOrder[]>([]);
  const [pendingAction, setPendingAction] = useState<OrderConfirmAction>(null);

  useEffect(() => {
    return listenOrdersForShop(storeId, (orders) => {
      setAllOrders(orders.map(toKitchen));
    });
  }, [storeId]);

  const orders = allOrders.filter((o) =>
    tab === "pending" ? o.status === "pending" : o.status !== "pending",
  );
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const doneCount = allOrders.filter((o) => o.status !== "pending").length;

  const handleConfirm = async () => {
    if (!pendingAction) return;
    const { orderId, type } = pendingAction;
    await updateOrderStatus(orderId, type === "complete" ? "completed" : "cancelled");
    setPendingAction(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">ออเดอร์</h1>
          <p className="mt-1 text-sm text-stone-400">ติดตามและจัดการออเดอร์ที่กำลังดำเนินการ</p>
        </div>
        <div className="flex gap-2 rounded-full border border-stone-200 bg-white p-1">
          <button
            onClick={() => setTab("pending")}
            className={
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition " +
              (tab === "pending" ? "bg-orange-700 text-white" : "text-stone-500 hover:text-stone-800")
            }
          >
            กำลังทำ ({pendingCount})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition " +
              (tab === "completed" ? "bg-orange-700 text-white" : "text-stone-500 hover:text-stone-800")
            }
          >
            เสร็จสิ้น ({doneCount})
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-400">ไม่มีออเดอร์ในหมวดนี้</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onRequestComplete={(id, queue) => setPendingAction({ orderId: id, queue, type: "complete" })}
              onRequestCancel={(id, queue) => setPendingAction({ orderId: id, queue, type: "cancel" })}
            />
          ))}
        </div>
      )}

      <OrderConfirmModal
        action={pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={() => void handleConfirm()}
      />
    </div>
  );
}
