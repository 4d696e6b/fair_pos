"use client";

import { useState } from "react";
import { Check, Printer } from "lucide-react";

type OrderStatus = "pending" | "completed";

type KitchenOrder = {
  id: string;
  table: string;
  type: "dine-in" | "takeaway";
  minutesAgo: number;
  isNew?: boolean;
  status: OrderStatus;
  items: { qty: number; name: string; note?: string; done?: boolean }[];
};

const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: "#8423",
    table: "โต๊ะ 12",
    type: "dine-in",
    minutesAgo: 24,
    status: "pending",
    items: [
      { qty: 2, name: "หมูกะเพรา", note: "ไม่เผ็ด" },
      { qty: 1, name: "ต้มยำกุ้ง", note: "น้ำใส" },
      { qty: 3, name: "ข้าวสวย" },
    ],
  },
  {
    id: "#8424",
    table: "สั่งกลับบ้าน A",
    type: "takeaway",
    minutesAgo: 12,
    status: "pending",
    items: [
      { qty: 1, name: "ผัดไทยกุ้งสด", done: true },
      { qty: 2, name: "แกงเขียวหวานไก่", note: "หน่อไม้เพิ่ม" },
    ],
  },
  {
    id: "#8425",
    table: "โต๊ะ 4",
    type: "dine-in",
    minutesAgo: 1,
    isNew: true,
    status: "pending",
    items: [
      { qty: 4, name: "ข้าวเหนียวมะม่วง" },
      { qty: 1, name: "ชาไทยเย็น" },
    ],
  },
  {
    id: "#8420",
    table: "โต๊ะ 7",
    type: "dine-in",
    minutesAgo: 40,
    status: "completed",
    items: [{ qty: 2, name: "ข้าวผัดกุ้ง", done: true }],
  },
];

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus>("pending");
  const orders = MOCK_ORDERS.filter((o) => o.status === tab);
  const pendingCount = MOCK_ORDERS.filter((o) => o.status === "pending").length;
  const completedCount = MOCK_ORDERS.filter((o) => o.status === "completed").length;

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
            เสร็จสิ้น ({completedCount})
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-400">ไม่มีออเดอร์ในหมวดนี้</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className={
                "flex flex-col rounded-2xl border bg-white p-5 shadow-sm " +
                (order.isNew ? "border-orange-300 ring-1 ring-orange-200" : "border-stone-100")
              }
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="font-bold text-stone-900">{order.table}</p>
                  <p className="text-xs text-stone-400">
                    ออเดอร์ {order.id} • {order.type === "dine-in" ? "ทานที่ร้าน" : "รับกลับบ้าน"}
                  </p>
                </div>
                {order.isNew ? (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    ใหม่
                  </span>
                ) : order.status === "pending" ? (
                  <span className="text-xs font-semibold text-red-500">{order.minutesAgo} น.</span>
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
                  {order.isNew ? (
                    <>
                      <button className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-stone-200 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50">
                        <Printer size={15} />
                        พิมพ์บิล
                      </button>
                      <button className="flex-1 cursor-pointer rounded-full bg-orange-700 py-2 text-sm font-semibold text-white transition hover:bg-orange-800">
                        เริ่มทำ
                      </button>
                    </>
                  ) : (
                    <button className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald-600 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                      <Check size={15} />
                      ทำเสร็จแล้ว
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
