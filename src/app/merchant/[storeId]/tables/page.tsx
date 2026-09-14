"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Banknote, QrCode, Trash2, X } from "lucide-react";
import { getShop } from "@/features/fairs";
import { completeOpenOrdersForTable, completeOrders, isOpenKitchenStatus, listenOrdersForShop } from "@/features/orders";
import { createTable, deleteTable, listTablesForShop, updateTable } from "@/features/tables";
import { useAuth } from "@/lib/auth-context";
import type { Order, Shop, ShopTable, TableStatus } from "@/lib/types";

const STATUS_STYLES: Record<TableStatus, { label: string; className: string }> = {
  empty: { label: "ว่าง", className: "border-stone-200 bg-white text-stone-400" },
  occupied: { label: "มีลูกค้า", className: "border-orange-200 bg-orange-50 text-orange-700" },
  "awaiting-payment": { label: "รอชำระเงิน", className: "border-red-200 bg-red-50 text-red-600" },
};

type TableView = ShopTable & { orders: Order[] };
type PayTarget =
  | { kind: "table"; id: string; label: string; total: number; lines: Order["lines"]; orderIds: string[] }
  | { kind: "takeaway"; id: string; label: string; total: number; lines: Order["lines"]; orderIds: string[] };

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

function qrImage(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data)}`;
}

function flattenLines(orders: Order[]) {
  return orders.flatMap((order) => order.lines);
}

export default function TablesPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const { user } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [tables, setTables] = useState<ShopTable[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [qrOpen, setQrOpen] = useState<{ title: string; data: string } | null>(null);
  const [payTarget, setPayTarget] = useState<PayTarget | null>(null);

  const takeawayOnly = shop?.sellingStyle === "takeaway";

  const loadTables = async () => {
    setTables(await listTablesForShop(storeId));
  };

  useEffect(() => {
    void getShop(storeId).then(setShop);
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
  const takeawayOrders = orders.filter(
    (order) => order.type === "takeaway" && isOpenKitchenStatus(order.status),
  );

  const handledBy = user?.displayName?.trim() || user?.email?.split("@")[0] || "ร้านค้า";

  const openPay = (target: PayTarget) => setPayTarget(target);

  const handlePay = async (method: "cash" | "promptpay") => {
    if (!payTarget) return;
    setPaying(true);
    try {
      if (payTarget.kind === "table") {
        await completeOpenOrdersForTable(storeId, payTarget.label, handledBy);
        await updateTable(payTarget.id, { status: "empty", total: 0, seatedMinutes: 0 });
        await loadTables();
      } else {
        await completeOrders(payTarget.orderIds, handledBy);
      }
      if (method === "promptpay") {
        setQrOpen(null);
      }
      setPayTarget(null);
    } finally {
      setPaying(false);
    }
  };

  const tableQrUrl = (table: ShopTable) => {
    const origin = typeof window === "undefined" ? "" : window.location.origin;
    const fairId = shop?.fairId || "standalone";
    return `${origin}/fairs/${fairId}/shops/${storeId}?table=${encodeURIComponent(table.label)}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">
            {takeawayOnly ? "จัดการออเดอร์" : "โต๊ะ + การชำระเงิน"}
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {takeawayOnly
              ? "ร้านนี้ขายแบบซื้อกลับเท่านั้น จึงจัดการออเดอร์เพื่อรับชำระเงินที่นี่"
              : "ยอดโต๊ะคำนวณจากออเดอร์ทานที่ร้านที่ยังไม่ปิดบิล"}
          </p>
        </div>
        {!takeawayOnly ? (
          <button
            onClick={() =>
              void createTable(storeId, `โต๊ะ ${tables.length + 1}`).then(loadTables)
            }
            className="cursor-pointer rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white"
          >
            เพิ่มโต๊ะ
          </button>
        ) : null}
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold text-stone-900">ออเดอร์สั่งกลับบ้าน</h2>
        {takeawayOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-200 py-8 text-center text-sm text-stone-400">
            ยังไม่มีออเดอร์สั่งกลับบ้านที่รอชำระ
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {takeawayOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-stone-900">คิว {order.queueNumber}</p>
                    <p className="text-xs text-stone-400">{order.refCode}</p>
                  </div>
                  <p className="font-semibold text-orange-700">฿{order.total.toFixed(2)}</p>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-stone-600">
                  {order.lines.map((line) => (
                    <li key={line.item.id} className="flex justify-between">
                      <span>
                        {line.qty}x {line.item.name}
                      </span>
                      <span>฿{(line.item.price * line.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openPay({
                        kind: "takeaway",
                        id: order.id,
                        label: `คิว ${order.queueNumber}`,
                        total: order.total,
                        lines: order.lines,
                        orderIds: [order.id],
                      })
                    }
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-orange-700 py-2 text-sm font-semibold text-white"
                  >
                    <Banknote size={15} />
                    ชำระเงิน
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {takeawayOnly ? null : (
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
                      {flattenLines(selected.orders).map((line, index) => (
                        <li key={`${line.item.id}-${index}`} className="flex justify-between text-stone-600">
                          <span>
                            {line.qty}x {line.item.name}
                          </span>
                          <span className="font-semibold text-stone-900">
                            ฿{(line.item.price * line.qty).toFixed(2)}
                          </span>
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
                      onClick={() =>
                        openPay({
                          kind: "table",
                          id: selected.id,
                          label: selected.label,
                          total: selected.total ?? 0,
                          lines: flattenLines(selected.orders),
                          orderIds: selected.orders.map((order) => order.id),
                        })
                      }
                      className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800"
                    >
                      <Banknote size={16} />
                      รับชำระเงิน
                    </button>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-stone-400">โต๊ะนี้ยังไม่มีออเดอร์</p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setQrOpen({
                        title: `QR ${selected.label}`,
                        data: tableQrUrl(selected),
                      })
                    }
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-stone-200 py-2 text-xs font-semibold text-stone-600"
                  >
                    <QrCode size={14} />
                    สร้างคิวอาร์โค้ด
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`ลบ${selected.label}?`)) return;
                      void deleteTable(selected.id).then(() => {
                        setSelectedId(null);
                        void loadTables();
                      });
                    }}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    <Trash2 size={14} />
                    ลบโต๊ะ
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-stone-400">เลือกโต๊ะเพื่อดูรายละเอียด</p>
            )}
          </div>
        </div>
      )}

      {payTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setPayTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">ชำระเงิน · {payTarget.label}</h2>
              <button
                type="button"
                onClick={() => setPayTarget(null)}
                className="cursor-pointer text-stone-400"
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="mb-4 space-y-2 text-sm text-stone-600">
              {payTarget.lines.map((line, index) => (
                <li key={`${line.item.id}-${index}`} className="flex justify-between">
                  <span>
                    {line.qty}x {line.item.name}
                  </span>
                  <span>฿{(line.item.price * line.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mb-5 flex justify-between text-base font-bold text-stone-900">
              <span>ยอดรวม</span>
              <span>฿{payTarget.total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={paying}
                onClick={() => void handlePay("cash")}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-orange-700 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                <Banknote size={16} />
                เงินสด
              </button>
              <button
                type="button"
                disabled={paying}
                onClick={() => {
                  setQrOpen({
                    title: `พร้อมเพย์ · ${payTarget.label}`,
                    data: `พร้อมเพย์ ${shop?.name ?? "Fair POS"} จำนวน ฿${payTarget.total.toFixed(2)}`,
                  });
                }}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-orange-200 py-3 text-sm font-semibold text-orange-700"
              >
                <QrCode size={16} />
                คิวอาร์พร้อมเพย์
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {qrOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setQrOpen(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">{qrOpen.title}</h2>
              <button
                type="button"
                onClick={() => setQrOpen(null)}
                className="cursor-pointer text-stone-400"
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>
            <img src={qrImage(qrOpen.data)} alt={qrOpen.title} className="mx-auto h-56 w-56" />
            <p className="mt-3 break-all text-xs text-stone-400">{qrOpen.data}</p>
            {payTarget ? (
              <button
                type="button"
                disabled={paying}
                onClick={() => void handlePay("promptpay")}
                className="mt-5 w-full cursor-pointer rounded-full bg-orange-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {paying ? "กำลังยืนยัน..." : "ยืนยันชำระแล้ว"}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
