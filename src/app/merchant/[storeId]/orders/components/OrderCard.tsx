"use client";

import { Check, ChefHat, CookingPot, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { OrderStatus } from "@/lib/types";

export type KitchenOrder = {
  id: string;
  refCode?: string;
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

const STATUS_BADGE: Partial<Record<OrderStatus, { label: string; className: string }>> = {
  received: { label: "รับออเดอร์", className: "bg-orange-100 text-orange-700" },
  preparing: { label: "กำลังปรุง", className: "bg-amber-50 text-amber-700" },
  ready: { label: "พร้อมรับ", className: "bg-sky-50 text-sky-700" },
  completed: { label: "เสร็จแล้ว", className: "bg-emerald-50 text-emerald-600" },
  cancelled: { label: "ยกเลิกแล้ว", className: "bg-red-50 text-red-500" },
};

export default function OrderCard({
  order,
  onAdvance,
  onRequestComplete,
  onRequestCancel,
}: {
  order: KitchenOrder;
  onAdvance: (id: string, next: OrderStatus) => void;
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

  const showAsNew = elapsedMinutes < 3 && order.status === "received";
  const badge = STATUS_BADGE[order.status];
  const isActive =
    order.status === "received" || order.status === "preparing" || order.status === "ready";

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
            {order.refCode ?? order.id} • {order.type === "dine-in" ? "ทานที่ร้าน" : "รับกลับบ้าน"}
          </p>
        </div>
        {showAsNew ? (
          <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
            ใหม่
          </span>
        ) : badge ? (
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
            {badge.label}
            {isActive ? ` • ${elapsedMinutes} น.` : ""}
          </span>
        ) : null}
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

      {isActive ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onRequestCancel(order.id, order.queue)}
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-red-600 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <X size={15} />
            ยกเลิก
          </button>
          {order.status === "received" ? (
            <button
              onClick={() => onAdvance(order.id, "preparing")}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-orange-700 py-2 text-sm font-semibold text-white transition hover:bg-orange-800"
            >
              <CookingPot size={15} />
              เริ่มปรุง
            </button>
          ) : null}
          {order.status === "preparing" ? (
            <button
              onClick={() => onAdvance(order.id, "ready")}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-sky-600 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <ChefHat size={15} />
              พร้อมรับ
            </button>
          ) : null}
          {order.status === "ready" && order.type === "takeaway" ? (
            <button
              onClick={() => onRequestComplete(order.id, order.queue)}
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Check size={15} />
              ส่งแล้ว
            </button>
          ) : null}
          {order.status === "ready" && order.type === "dine-in" ? (
            <p className="flex w-full items-center justify-center rounded-full bg-stone-100 py-2 text-xs font-medium text-stone-500">
              รอชำระเงินที่โต๊ะ
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
