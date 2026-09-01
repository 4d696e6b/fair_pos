"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard } from "lucide-react";
import { completeOpenOrdersForTable, isOpenKitchenStatus, listenOrdersForShop } from "@/features/orders";
import { createTable, listTablesForShop, updateTable } from "@/features/tables";
import { useAuth } from "@/lib/auth-context";
import type { Order, ShopTable, TableStatus } from "@/lib/types";

const STATUS_STYLES: Record<TableStatus, { label: string; className: string }> = {
  empty: { label: "ว่าง", className: "border-stone-200 bg-white text-stone-400" },
  occupied: { label: "มีลูกค้า", className: "border-orange-200 bg-orange-50 text-orange-700" },
  "awaiting-payment": { label: "รอชำระเงิน", className: "border-red-200 bg-red-50 text-red-600" },
};

type TableView = ShopTable & { orders: Order[] };

function deriveTable(table: ShopTable, orders: Order[]): TableView {
  const open = orders.filter(
    (order) => order.tableLabel === table.label && isOpenKitchenStatus(order.status),
  );
  const total = open.reduce((sum, order) => sum + order.total, 0);
  const oldest = [...open].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
  const seatedMinutes = oldest
    ? Math.max(0, Math.floor((Date.now() - new Date(oldest.createdAt).getTime()) / 60000))
    : 0;
  const status: TableStatus =
    open.length === 0
      ? "empty"
      : open.every((order) => order.status === "ready")
        ? "awaiting-payment"
        : "occupied";

  return { ...table, status, total, seatedMinutes, orders: open };
}

export default function TablesPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { user } = useAuth();
  const [tables, setTables] = useState<ShopTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const loadTables = async () => {
    setTables(await listTablesForShop(storeId));
  };

  useEffect(() => {
    void loadTables();
  }, [storeId]);

  useEffect(() => {
    return listenOrdersForShop(storeId, setOrders);
  }, [storeId]);

  const views = useMemo(
    () => tables.map((table) => deriveTable(table, orders)),
    [tables, orders],
  );
  const selected = views.find((table) => table.id === selectedId) ?? null;

  const handlePay = async () => {
    if (!selected || selected.orders.length === 0) return;
    setPaying(true);
    try {
      const handledBy = user?.displayName?.trim() || user?.email?.split("@")[0] || "ร้านค้า";
      await completeOpenOrdersForTable(storeId, selected.label, handledBy);
      await updateTable(selected.id, { status: "empty", total: 0, seatedMinutes: 0 });
      await loadTables();
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">โต๊ะ + การชำระเงิน</h1>
          <p className="mt-1 text-sm text-stone-400">ยอดโต๊ะคำนวณจากออเดอร์ทานที่ร้านที่ยังไม่ปิดบิล</p>
        </div>
        <button
          onClick={() =>
            void createTable(storeId, `โต๊ะ ${tables.length + 1}`).then(loadTables)
          }
          className="rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white"
        >
          เพิ่มโต๊ะ
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {views.map((table) => {
            const style = STATUS_STYLES[table.status];
            return (
              <button
                key={table.id}
                onClick={() => setSelectedId(table.id)}
                className={
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-5 text-center shadow-sm transition hover:shadow-md " +
                  style.className +
                  (selectedId === table.id ? " ring-2 ring-orange-400" : "")
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

              {selected.orders.length > 0 ? (
                <>
                  <ul className="mb-4 space-y-2 text-sm">
                    {selected.orders.map((order) => (
                      <li key={order.id} className="flex justify-between text-stone-600">
                        <span>
                          {order.queueNumber} · {order.refCode}
                        </span>
                        <span className="font-semibold text-stone-900">฿{order.total.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between text-sm text-stone-600">
                    <span>ยอดรวม</span>
                    <span className="font-semibold text-stone-900">
                      ฿{(selected.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => void handlePay()}
                    disabled={paying}
                    className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 disabled:opacity-60"
                  >
                    <CreditCard size={16} />
                    {paying ? "กำลังรับชำระ..." : "รับชำระเงิน (เงินสด)"}
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
