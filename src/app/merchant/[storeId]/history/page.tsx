"use client";

import { useState } from "react";
import { Download, Filter, Search } from "lucide-react";

type HistoryStatus = "completed" | "preparing" | "cancelled";

type HistoryOrder = {
  id: string;
  date: string;
  time: string;
  total: number;
  status: HistoryStatus;
  employee: string;
};

const MOCK_HISTORY: HistoryOrder[] = [
  { id: "#ORD-1042", date: "12 พ.ย. 2026", time: "14:32 น.", total: 840, status: "completed", employee: "-" },
  { id: "#ORD-1041", date: "12 พ.ย. 2026", time: "14:15 น.", total: 1250, status: "preparing", employee: "-" },
  { id: "#ORD-1040", date: "12 พ.ย. 2026", time: "13:45 น.", total: 450, status: "cancelled", employee: "แอดมิน" },
  { id: "#ORD-1039", date: "12 พ.ย. 2026", time: "13:10 น.", total: 920, status: "completed", employee: "-" },
];

const STATUS_STYLES: Record<HistoryStatus, { label: string; className: string }> = {
  completed: { label: "เสร็จสิ้น", className: "bg-emerald-50 text-emerald-600" },
  preparing: { label: "กำลังเตรียม", className: "bg-stone-100 text-stone-500" },
  cancelled: { label: "ยกเลิก", className: "bg-red-50 text-red-500" },
};

const TABS: { key: "all" | HistoryStatus; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "completed", label: "เสร็จสิ้น" },
  { key: "preparing", label: "กำลังเตรียม" },
  { key: "cancelled", label: "ยกเลิก" },
];

export default function OrderHistoryPage() {
  const [tab, setTab] = useState<"all" | HistoryStatus>("all");
  const [search, setSearch] = useState("");

  const orders = MOCK_HISTORY.filter(
    (o) => (tab === "all" || o.status === tab) && o.id.toLowerCase().includes(search.toLowerCase()),
  );

  const todayCount = MOCK_HISTORY.length;
  const totalSales = MOCK_HISTORY.reduce((sum, o) => sum + o.total, 0);
  const cancelledCount = MOCK_HISTORY.filter((o) => o.status === "cancelled").length;
  const avgPerBill = Math.round(totalSales / MOCK_HISTORY.length);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">ประวัติคำสั่งซื้อและบันทึก</h1>
          <p className="mt-1 text-sm text-stone-400">ดูและตรวจสอบคำสั่งซื้อทั้งหมดที่ดำเนินการในระบบ</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา Order ID..."
              className="w-56 rounded-full border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-400"
            />
          </div>
          <button
            aria-label="ตัวกรอง"
            className="cursor-pointer rounded-full border border-stone-200 bg-white p-2.5 text-stone-500 transition hover:bg-stone-50"
          >
            <Filter size={16} />
          </button>
          <button
            aria-label="ดาวน์โหลด"
            className="cursor-pointer rounded-full border border-stone-200 bg-white p-2.5 text-stone-500 transition hover:bg-stone-50"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-400">คำสั่งซื้อวันนี้</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{todayCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-400">ยอดขายรวม</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">฿{totalSales.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-400">ถูกยกเลิก (วันนี้)</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{cancelledCount}</p>
        </div>
        <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-stone-400">เฉลี่ยต่อบิล</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">฿{avgPerBill}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white shadow-sm">
        <div className="flex gap-2 border-b border-stone-100 p-4">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={
                "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition " +
                (tab === key ? "bg-orange-700 text-white" : "text-stone-500 hover:bg-stone-50")
              }
            >
              {label}
            </button>
          ))}
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-stone-400">
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">วันที่/เวลา</th>
              <th className="px-6 py-3 font-medium">ยอดรวม</th>
              <th className="px-6 py-3 font-medium">สถานะ</th>
              <th className="px-6 py-3 font-medium">พนักงาน</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-stone-100">
                <td className="px-6 py-4 font-semibold text-stone-800">{order.id}</td>
                <td className="px-6 py-4 text-stone-500">
                  {order.date} {order.time}
                </td>
                <td className="px-6 py-4 font-semibold text-stone-900">฿{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status].className}`}
                  >
                    {STATUS_STYLES[order.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 text-stone-500">{order.employee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
