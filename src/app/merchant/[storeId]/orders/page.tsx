"use client";

import { useState } from "react";
import OrderCard, { KitchenOrder, OrderStatus } from "./components/OrderCard";
import OrderConfirmModal, { OrderConfirmAction } from "./components/OrderConfirmModal";

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: "#REF-53432-WY",
    queue: "A844",
    table: "โต๊ะ 12",
    type: "dine-in",
    createdAt: new Date(Date.now() - 24 * 60_000).toISOString(),
    status: "pending",
    items: [
      { qty: 2, name: "หมูกะเพรา", note: "ไม่เผ็ด" },
      { qty: 1, name: "ต้มยำกุ้ง", note: "น้ำใส" },
      { qty: 3, name: "ข้าวสวย" },
    ],
  },
  {
    id: "#REF-51072-WY",
    table: "สั่งกลับบ้าน A",
    queue: "A824",
    type: "takeaway",
    createdAt: new Date(Date.now() - 12 * 60_000).toISOString(),
    status: "pending",
    items: [
      { qty: 1, name: "ผัดไทยกุ้งสด" },
      { qty: 2, name: "แกงเขียวหวานไก่", note: "หน่อไม้เพิ่ม" },
    ],
  },
  {
    id: "#REF-35489-WY",
    table: "โต๊ะ 4",
    queue: "A823",
    type: "dine-in",
    createdAt: new Date(Date.now() - 1 * 60_000).toISOString(),
    status: "pending",
    items: [
      { qty: 4, name: "ข้าวเหนียวมะม่วง" },
      { qty: 1, name: "ชาไทยเย็น" },
    ],
  },
  {
    id: "#REF-34587-WY",
    table: "โต๊ะ 7",
    queue: "A834",
    type: "dine-in",
    createdAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    status: "completed",
    items: [{ qty: 2, name: "ข้าวผัดกุ้ง", done: true }],
  },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus>("pending");
  const [allOrders, setAllOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [pendingAction, setPendingAction] = useState<OrderConfirmAction>(null);

  const orders = allOrders.filter((o) =>
    tab === "pending" ? o.status === "pending" : o.status !== "pending",
  );
  const pendingCount = allOrders.filter((o) => o.status === "pending").length;
  const doneCount = allOrders.filter((o) => o.status !== "pending").length;

  const handleConfirm = () => {
    if (!pendingAction) return;
    const { orderId, type } = pendingAction;

    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              isNew: false,
              status: type === "complete" ? "completed" : "cancelled",
              items:
                type === "complete"
                  ? o.items.map((item) => ({ ...item, done: true }))
                  : o.items,
            }
          : o,
      ),
    );
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
        onConfirm={handleConfirm}
      />
    </div>
  );
}