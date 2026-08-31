"use client";

import { ChefHat, ChevronDown, Store, Timer } from "lucide-react";
import Dropdown from "@/components/shared/Dropdown";

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

  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <p className="text-center text-xs text-stone-400">รหัสอ้างอิง: {order.refCode}</p>

      <div className="mt-1 flex justify-center">
        {hasMultipleOrders ? (
          <Dropdown
            items={orders}
            getKey={(o) => o.id}
            isSelected={(o) => o.id === order.id}
            onSelect={(o) => onSelectOrder(o.id)}
            renderTrigger={({ isOpen }) => (
              <div className="flex items-center gap-1.5 rounded-xl px-2 py-1 transition hover:bg-stone-50">
                <span className="text-4xl font-extrabold text-orange-700">
                  {order.queueNumber}
                </span>
                <ChevronDown
                  size={20}
                  className={`mt-2 text-stone-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            )}
            renderItem={(o, { isSelected }) => (
              <>
                <span className={isSelected ? "font-semibold text-orange-600" : "text-stone-600"}>
                  คิว {o.queueNumber}
                </span>
                {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> : null}
              </>
            )}
          />
        ) : (
          <p className="text-center text-4xl font-extrabold text-orange-700">
            {order.queueNumber}
          </p>
        )}
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
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
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
          <p className="text-sm font-semibold text-stone-900">{order.estimatedMinutes}</p>
          <p className="text-xs text-stone-400">สั่งเมื่อ: {order.createdAt}</p>
        </div>
      </div>
    </div>
  );
}