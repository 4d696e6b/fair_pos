"use client";

import { useEffect, useRef, useState } from "react";
import { ChefHat, ChevronDown, Store, Timer } from "lucide-react";

const STAGES = [
  { key: "received", label: "รับออเดอร์" },
  { key: "preparing", label: "กำลังปรุง" },
  { key: "ready", label: "พร้อมรับ" },
] as const;

type OrderStatus = (typeof STAGES)[number]["key"];

export type OrderSummaryFields = {
  id: string;
  refCode: string;
  queueNumber: string | number;
  status: OrderStatus;
  estimatedMinutes: string;
  createdAt: string;
};

export default function OrderStatusCard({
  order,
  shopName,
  boothNumber,
  orders,
  onSelectOrder,
}: {
  order: OrderSummaryFields;
  shopName?: string;
  boothNumber?: string;
  orders: OrderSummaryFields[];
  onSelectOrder: (orderId: string) => void;
}) {
  const stageIndex = STAGES.findIndex((s) => s.key === order.status);
  const hasMultipleOrders = orders.length > 1;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <p className="text-center text-xs text-stone-400">รหัสอ้างอิง: {order.refCode}</p>

      <div ref={containerRef} className="relative mx-auto mt-1 flex justify-center">
        {hasMultipleOrders ? (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl px-2 py-1 transition hover:bg-stone-50"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="text-4xl font-extrabold text-orange-700">
              {order.queueNumber}
            </span>
            <ChevronDown
              size={20}
              className={`mt-2 text-stone-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <p className="text-center text-4xl font-extrabold text-orange-700">
            {order.queueNumber}
          </p>
        )}

        {hasMultipleOrders && isOpen ? (
          <div
            role="listbox"
            className="absolute top-full z-10 mt-2 w-40 overflow-hidden rounded-xl border border-stone-100 bg-white py-1 shadow-lg"
          >
            {orders.map((o) => (
              <button
                key={o.id}
                type="button"
                role="option"
                aria-selected={o.id === order.id}
                onClick={() => {
                  onSelectOrder(o.id);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition hover:bg-orange-50 ${
                  o.id === order.id ? "font-semibold text-orange-600" : "text-stone-600"
                }`}
              >
                <span>คิว {o.queueNumber}</span>
                {o.id === order.id ? <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="my-5 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ChefHat size={26} />
        </div>
      </div>

      <p className="text-center font-bold text-stone-900">กำลังเตรียมอาหาร</p>
      <p className="mx-auto mt-1 max-w-xs text-center text-sm text-stone-400">
        ออเดอร์ของคุณกำลังถูกปรุงอย่างพิถีพิถัน โปรดรอเรียกคิวเมื่ออาหารพร้อม
      </p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-medium text-stone-500">
          {STAGES.map((s, i) => (
            <span key={s.key} className={i <= stageIndex ? "text-orange-700" : ""}>
              {s.label}
            </span>
          ))}
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${((stageIndex + 1) / STAGES.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-stone-100 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-stone-400">
            <Store size={14} />
            <span className="text-xs">ร้านค้า</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">{shopName}</p>
          <p className="text-xs text-stone-400">บูธ {boothNumber}</p>
        </div>
        <div className="rounded-xl border border-stone-100 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-stone-400">
            <Timer size={14} />
            <span className="text-xs">เวลาโดยประมาณ</span>
          </div>
          <p className="text-sm font-semibold text-stone-900">
            {order.estimatedMinutes}
          </p>
          <p className="text-xs text-stone-400">สั่งเมื่อ: {order.createdAt}</p>
        </div>
      </div>
    </div>
  );
}