"use client";

import { Clock, CreditCard, ReceiptText, TrendingUp } from "lucide-react";

const STATS = [
  { label: "ยอดขายรวม (Total Sales)", value: "฿45,230", delta: "+12% จากสัปดาห์ก่อน", icon: CreditCard },
  { label: "จำนวนออเดอร์ (Orders)", value: "142", delta: "+5% จากสัปดาห์ก่อน", icon: ReceiptText },
  { label: "เวลาเฉลี่ย/ออเดอร์ (Avg Time)", value: "12m 45s", delta: "+1m จากสัปดาห์ก่อน", icon: Clock },
  { label: "รายรับ/รายจ่าย (Net Income)", value: "฿32,100", delta: "สุขภาพเงินแข็งแรง", icon: TrendingUp },
];

const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์", "อาทิตย์"];
const INCOME = [15, 17, 19, 24, 32, 33, 28];
const EXPENSE = [10, 11, 12, 13, 14, 15, 13];

const TOP_ITEMS = [
  { name: "ผัดไทยกุ้งสด", total: "฿3,780", orders: 42 },
  { name: "ชาไทยเย็น", total: "฿1,900", orders: 38 },
  { name: "ต้มยำกุ้ง", total: "฿4,500", orders: 25 },
  { name: "ข้าวเหนียวมะม่วง", total: "฿2,400", orders: 20 },
];

function buildLinePath(values: number[], width: number, height: number, padding: number) {
  const max = Math.max(...INCOME, ...EXPENSE);
  const min = 0;
  const stepX = (width - padding * 2) / (values.length - 1);

  return values
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((v - min) / (max - min)) * (height - padding * 2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export default function DashboardPage() {
  const width = 640;
  const height = 220;
  const padding = 20;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-stone-400">ภาพรวมยอดขายและผลการดำเนินงานของร้าน</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(({ label, value, delta, icon: Icon }) => (
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
              d={buildLinePath(INCOME, width, height, padding)}
              fill="none"
              stroke="#c2410c"
              strokeWidth={2.5}
            />
            <path
              d={buildLinePath(EXPENSE, width, height, padding)}
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
            <button className="cursor-pointer text-xs font-medium text-orange-600 hover:text-orange-700">
              ดูทั้งหมด
            </button>
          </div>

          <ul className="space-y-3">
            {TOP_ITEMS.map((item) => (
              <li key={item.name} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-stone-100" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-800">{item.name}</p>
                  <p className="text-xs text-stone-400">{item.orders} ออเดอร์</p>
                </div>
                <span className="text-sm font-semibold text-orange-700">{item.total}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
