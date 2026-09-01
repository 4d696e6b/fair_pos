"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Clock, CreditCard, ReceiptText, TrendingUp } from "lucide-react";
import { getShopCosts } from "@/features/finance";
import { listOrdersForShop } from "@/features/orders";
import type { Order } from "@/lib/types";

const DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];

function buildLinePath(values: number[], width: number, height: number, padding: number) {
  const max = Math.max(...values, 1);
  const min = 0;
  const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);

  return values
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / (max - min)) * (height - padding * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function DashboardPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyExpense, setDailyExpense] = useState(0);
  const width = 640;
  const height = 220;
  const padding = 20;

  useEffect(() => {
    void Promise.all([listOrdersForShop(storeId), getShopCosts(storeId)]).then(
      ([nextOrders, costs]) => {
        setOrders(nextOrders);
        setDailyExpense((costs.boothRent + costs.wages + costs.ingredients + costs.misc) / 30);
      },
    );
  }, [storeId]);

  const completed = orders.filter(
    (order) => order.status === "completed" || order.status === "ready",
  );
  const totalSales = completed.reduce((sum, order) => sum + order.total, 0);
  const netIncome = totalSales - dailyExpense * 30;

  const incomeByDay = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    completed.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      buckets[day] += order.total;
    });
    return buckets;
  }, [completed]);

  const expenseByDay = incomeByDay.map(() => Math.round(dailyExpense));

  const topItems = useMemo(() => {
    const counts = new Map<string, { name: string; total: number; orders: number }>();
    completed.forEach((order) => {
      order.lines.forEach((line) => {
        const current = counts.get(line.item.name) ?? {
          name: line.item.name,
          total: 0,
          orders: 0,
        };
        current.total += line.item.price * line.qty;
        current.orders += line.qty;
        counts.set(line.item.name, current);
      });
    });
    return [...counts.values()].sort((a, b) => b.total - a.total).slice(0, 4);
  }, [completed]);

  const stats = [
    {
      label: "ยอดขายรวม (Total Sales)",
      value: `฿${totalSales.toLocaleString()}`,
      delta: `${completed.length} ออเดอร์ที่เสร็จ`,
      icon: CreditCard,
    },
    {
      label: "จำนวนออเดอร์ (Orders)",
      value: String(orders.length),
      delta: "ทั้งหมดในร้านนี้",
      icon: ReceiptText,
    },
    {
      label: "เวลาเฉลี่ย/ออเดอร์ (Avg Time)",
      value: "—",
      delta: "คำนวณเมื่อมี timestamp ครบ",
      icon: Clock,
    },
    {
      label: "รายรับ/รายจ่าย (Net Income)",
      value: `฿${Math.round(netIncome).toLocaleString()}`,
      delta: netIncome >= 0 ? "กำไร" : "ขาดทุน",
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-stone-400">ภาพรวมยอดขายจากออเดอร์จริงใน Firestore</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, delta, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-stone-400">
              <Icon size={16} />
              <span className="text-xs">{label}</span>
            </div>
            <p className="text-2xl font-bold text-stone-900">{value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">{delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold text-stone-900">แนวโน้มรายรับ - รายจ่าย (Income/Expense Trends)</p>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                รายรับ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-stone-400" />
                รายจ่าย
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            <path
              d={buildLinePath(incomeByDay, width, height, padding)}
              fill="none"
              stroke="#c2410c"
              strokeWidth={2.5}
            />
            <path
              d={buildLinePath(expenseByDay, width, height, padding)}
              fill="none"
              stroke="#a8a29e"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </svg>

          <div className="mt-1 flex justify-between text-xs text-stone-400">
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold text-stone-900">เมนูยอดฮิต (Top Items)</p>
          </div>

          {topItems.length === 0 ? (
            <p className="text-sm text-stone-400">ยังไม่มีออเดอร์ที่เสร็จสิ้น</p>
          ) : (
            <ul className="space-y-3">
              {topItems.map((item) => (
                <li key={item.name} className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-stone-100" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
                    <p className="text-xs text-stone-400">{item.orders} ชิ้น</p>
                  </div>
                  <span className="text-sm font-semibold text-orange-700">
                    ฿{item.total.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
