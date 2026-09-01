"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { listTablesForShop, updateTable } from "@/features/tables";
import type { ShopTable, TableStatus } from "@/lib/types";

const STATUS_STYLES: Record<TableStatus, { label: string; className: string }> = {
  empty: { label: "ว่าง", className: "border-stone-200 bg-white text-stone-400" },
  occupied: { label: "มีลูกค้า", className: "border-orange-200 bg-orange-50 text-orange-700" },
  "awaiting-payment": { label: "รอชำระเงิน", className: "border-red-200 bg-red-50 text-red-600" },
};

export default function TablesPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [tables, setTables] = useState<ShopTable[]>([]);
  const [selected, setSelected] = useState<ShopTable | null>(null);

  const load = async () => {
    const next = await listTablesForShop(storeId);
    setTables(next);
  };

  useEffect(() => {
    void load();
  }, [storeId]);

  const handlePay = async () => {
    if (!selected) return;
    await updateTable(selected.id, { status: "empty", total: 0, seatedMinutes: 0 });
    setSelected(null);
    await load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">โต๊ะ + การชำระเงิน</h1>
        <p className="mt-1 text-sm text-stone-400">ดูสถานะโต๊ะและจัดการการชำระเงิน</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => {
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
                  <button
                    onClick={() => void handlePay()}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"
                  >
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
