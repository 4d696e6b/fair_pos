"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";

type TableStatus = "empty" | "occupied" | "awaiting-payment";

type TableInfo = {
  id: string;
  label: string;
  status: TableStatus;
  total?: number;
  seatedMinutes?: number;
};

const STATUS_STYLES: Record<TableStatus, { label: string; className: string }> = {
  empty: { label: "ว่าง", className: "border-stone-200 bg-white text-stone-400" },
  occupied: { label: "มีลูกค้า", className: "border-orange-200 bg-orange-50 text-orange-700" },
  "awaiting-payment": { label: "รอชำระเงิน", className: "border-red-200 bg-red-50 text-red-600" },
};

const MOCK_TABLES: TableInfo[] = [
  { id: "t1", label: "โต๊ะ 1", status: "empty" },
  { id: "t2", label: "โต๊ะ 2", status: "occupied", total: 480, seatedMinutes: 18 },
  { id: "t3", label: "โต๊ะ 3", status: "empty" },
  { id: "t4", label: "โต๊ะ 4", status: "occupied", total: 920, seatedMinutes: 42 },
  { id: "t5", label: "โต๊ะ 5", status: "awaiting-payment", total: 640, seatedMinutes: 55 },
  { id: "t6", label: "โต๊ะ 6", status: "empty" },
  { id: "t7", label: "โต๊ะ 7", status: "occupied", total: 260, seatedMinutes: 6 },
  { id: "t8", label: "โต๊ะ 8", status: "empty" },
];

export default function TablesPage() {
  const [selected, setSelected] = useState<TableInfo | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">โต๊ะ + การชำระเงิน</h1>
        <p className="mt-1 text-sm text-stone-400">ดูสถานะโต๊ะและจัดการการชำระเงิน</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {MOCK_TABLES.map((table) => {
            const style = STATUS_STYLES[table.status];
            return (
              <button
                key={table.id}
                onClick={() => setSelected(table)}
                className={
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-5 text-center shadow-sm transition hover:shadow-md " +
                  style.className +
                  (selected?.id === table.id ? " ring-2 ring-orange-400" : "")
                }
              >
                <p className="font-bold text-stone-900">{table.label}</p>
                <span className="mt-2 rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium">
                  {style.label}
                </span>
                {table.total ? (
                  <p className="mt-2 text-sm font-semibold text-stone-700">
                    ฿{table.total.toFixed(2)}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          {selected ? (
            <>
              <p className="font-bold text-stone-900">{selected.label}</p>
              <p className="mt-1 text-xs text-stone-400">
                {STATUS_STYLES[selected.status].label}
                {selected.seatedMinutes ? ` • นั่งมาแล้ว ${selected.seatedMinutes} นาที` : ""}
              </p>

              <div className="my-4 h-px bg-stone-100" />

              {selected.total ? (
                <>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>ยอดรวม</span>
                    <span className="font-semibold text-stone-900">
                      ฿{selected.total.toFixed(2)}
                    </span>
                  </div>
                  <button className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800">
                    <CreditCard size={16} />
                    รับชำระเงิน
                  </button>
                </>
              ) : (
                <p className="mt-4 text-sm text-stone-400">โต๊ะนี้ยังไม่มีออเดอร์</p>
              )}
            </>
          ) : (
            <p className="text-center text-sm text-stone-400">เลือกโต๊ะเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>
    </div>
  );
}
