"use client";

import { use } from "react";
import Link from "next/link";
import { ChefHat, Receipt, Store, Timer } from "lucide-react";
import { getShop } from "@/lib/mock-data";
import { useOrder } from "@/lib/order-context";

const STAGES = [
  { key: "received", label: "รับออเดอร์" },
  { key: "preparing", label: "กำลังปรุง" },
  { key: "ready", label: "พร้อมรับ" },
] as const;

export default function ShopOrdersPage({
  params,
}: {
  params: Promise<{ fairId: string; shopId: string }>;
}) {
  const { fairId, shopId } = use(params);
  const shop = getShop(shopId);
  const { order } = useOrder();

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <p className="text-stone-500">คุณยังไม่มีออเดอร์ที่กำลังดำเนินการ</p>
        <Link
          href={`/fairs/${fairId}/shops/${shopId}`}
          className="mt-4 inline-block rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          ไปที่เมนูอาหาร
        </Link>
      </div>
    );
  }

  const stageIndex = STAGES.findIndex((s) => s.key === order.status);

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 sm:grid-cols-2">
      {/* Status card */}
      <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
        <p className="text-center text-xs text-stone-400">หมายเลขคิวของคุณ</p>
        <p className="text-center text-4xl font-extrabold text-brand-700">
          {order.queueNumber}
        </p>

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
              <span
                key={s.key}
                className={i <= stageIndex ? "text-brand-700" : ""}
              >
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
            <p className="text-sm font-semibold text-stone-900">{shop?.name}</p>
            <p className="text-xs text-stone-400">บูธ {shop?.boothNumber}</p>
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

      {/* E-ticket */}
      <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
        <p className="text-center font-bold text-stone-900">E-Ticket</p>
        <p className="text-center text-xs text-stone-400">
          แสดง QR Code นี้เพื่อรับอาหาร
        </p>

        <div className="mx-auto my-5 flex h-40 w-40 items-center justify-center rounded-xl bg-stone-100 text-xs text-stone-400">
          QR Code
        </div>

        <p className="text-center text-xs text-stone-400">รหัสอ้างอิง</p>
        <p className="text-center text-sm font-semibold tracking-wide text-stone-800">
          {order.refCode}
        </p>

        <div className="my-4 border-t border-dashed border-stone-200" />

        <p className="mb-2 text-sm font-semibold text-stone-700">
          สรุปรายการ ({order.lines.length})
        </p>
        <ul className="space-y-1 text-sm text-stone-600">
          {order.lines.map((line) => (
            <li key={line.item.id} className="flex justify-between">
              <span>
                {line.qty}x {line.item.name}
              </span>
              <span>฿{(line.item.price * line.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 py-2.5 text-sm font-medium text-stone-600 transition hover:border-stone-400">
          <Receipt size={16} />
          ดูใบเสร็จเต็ม
        </button>
      </div>
    </div>
  );
}
