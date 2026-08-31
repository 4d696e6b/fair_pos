"use client";

import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

export type OrderStatus = "pending" | "completed" | "cancelled";

export type KitchenOrder = {
  id: string;
  table: string;
  queue: string;
  type: "dine-in" | "takeaway";
  createdAt: string;
  status: OrderStatus;
  items: { qty: number; name: string; note?: string; done?: boolean }[];
};

function getElapsedMinutes(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

export default function OrderCard({
  order,
  onRequestComplete,
  onRequestCancel,
}: {
  order: KitchenOrder;
  onRequestComplete: (id: string, queue: string) => void;
  onRequestCancel: (id: string, queue: string) => void;
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(() => getElapsedMinutes(order.createdAt));

  useEffect(() => {
    setElapsedMinutes(getElapsedMinutes(order.createdAt));
    const interval = setInterval(() => {
      setElapsedMinutes(getElapsedMinutes(order.createdAt));
    }, 30000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const showAsNew = elapsedMinutes < 3;

  return (
    <div
      className={
        "flex flex-col rounded-2xl border bg-white p-5 shadow-sm " +
        (showAsNew ? "border-orange-300 ring-1 ring-orange-200" : "border-stone-100")
      }
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="font-bold text-stone-900">{order.table} ({order.queue})</p>
          <p className="text-xs text-stone-400">
            {order.id} • {order.type === "dine-in" ? "ทานที่ร้าน" : "รับกลับบ้าน"}
          </p>
        </div>
        {showAsNew ? (
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
            ใหม่
          </span>
        ) : order.status === "pending" ? (
          <span className="text-xs font-semibold text-red-500">{elapsedMinutes} น.</span>
        ) : order.status === "cancelled" ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
            ยกเลิกแล้ว
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            เสร็จแล้ว
          </span>
        )}
      </div>

      <ul className="flex-1 space-y-2 border-t border-stone-100 pt-3 text-sm">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span className={item.done ? "text-stone-300 line-through" : "text-stone-700"}>
              {item.qty}x {item.name}
            </span>
            {item.note ? (
              <span className="text-xs font-medium text-orange-600">{item.note}</span>
            ) : null}
          </li>
        ))}
      </ul>

      {order.status === "pending" ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onRequestCancel(order.id, order.queue)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <X size={15} />
            ยกเลิกออเดอร์
          </button>
          <button
            onClick={() => onRequestComplete(order.id, order.queue)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Check size={15} />
            ทำเสร็จแล้ว
          </button>
        </div>
      ) : null}
    </div>
  );
}
