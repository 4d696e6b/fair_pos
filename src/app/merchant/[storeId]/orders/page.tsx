"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OrderCard, { KitchenOrder } from "./components/OrderCard";
import OrderConfirmModal, { OrderConfirmAction } from "./components/OrderConfirmModal";
import { listenOrdersForShop, updateOrderStatus } from "@/features/orders";
import { useAuth } from "@/lib/auth-context";
import type { Order, OrderStatus } from "@/lib/types";

function toKitchen(order: Order): KitchenOrder {
  return {
    id: order.id,
    refCode: order.refCode,
    table: order.tableLabel ?? (order.type === "takeaway" ? "สั่งกลับบ้าน" : "หน้าร้าน"),
    queue: order.queueNumber,
    type: order.type,
    createdAt: order.createdAt,
    status: order.status,
    items: order.lines.map((line) => ({
      qty: line.qty,
      name: line.item.name,
      note: line.note,
      done: order.status === "completed",
    })),
  };
}

function handlerName(displayName: string | null | undefined, email: string | null | undefined) {
  return displayName?.trim() || email?.split("@")[0] || "ร้านค้า";
}

export default function OrdersPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { user } = useAuth();
  const [tab, setTab] = useState<"active" | "done">("active");
  const [allOrders, setAllOrders] = useState<KitchenOrder[]>([]);
  const [pendingAction, setPendingAction] = useState<OrderConfirmAction>(null);

  useEffect(() => {
    return listenOrdersForShop(storeId, (orders) => {
      setAllOrders(orders.map(toKitchen));
    });
  }, [storeId]);

  const isActive = (status: OrderStatus) =>
    status === "received" || status === "preparing" || status === "ready";

  const orders = allOrders.filter((o) => (tab === "active" ? isActive(o.status) : !isActive(o.status)));
  const pendingCount = allOrders.filter((o) => isActive(o.status)).length;
  const doneCount = allOrders.length - pendingCount;
  const handledBy = handlerName(user?.displayName, user?.email);

  const handleConfirm = async () => {
    if (!pendingAction) return;
    const { orderId, type } = pendingAction;
    await updateOrderStatus(orderId, type === "complete" ? "completed" : "cancelled", handledBy);
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
            onClick={() => setTab("active")}
            className={
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition " +
              (tab === "active" ? "bg-orange-700 text-white" : "text-stone-500 hover:text-stone-800")
            }
          >
            กำลังทำ ({pendingCount})
          </button>
          <button
            onClick={() => setTab("done")}
            className={
              "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition " +
              (tab === "done" ? "bg-orange-700 text-white" : "text-stone-500 hover:text-stone-800")
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
              onAdvance={(id, next) => void updateOrderStatus(id, next, handledBy)}
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
