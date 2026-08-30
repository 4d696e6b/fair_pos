"use client";

import { useState } from "react";
import { Store, Users, Package, Truck } from "lucide-react";

const MONTHS = ["สิงหาคม 2026", "กันยายน 2026", "ตุลาคม 2026"];

const COSTS = [
  { label: "ค่าเช่าบูธ (Booth Rent)", value: 15000, icon: Store },
  { label: "ค่าจ้างพนักงาน (Wages)", value: 25000, icon: Users },
  { label: "วัตถุดิบ (Ingredients - COGS)", value: 40000, icon: Package },
  { label: "ค่าขนส่งและอื่นๆ (Misc/Fixed)", value: 5000, icon: Truck },
];

const GROSS_REVENUE = 120000;
const COGS = 40000;
const FIXED_COSTS = 45000;

export default function FinancePage() {
  const [month, setMonth] = useState(MONTHS[2]);

  const totalCosts = COSTS.reduce((sum, c) => sum + c.value, 0);
  const grossProfit = GROSS_REVENUE - COGS;
  const netProfit = grossProfit - FIXED_COSTS;
  const margin = Math.round((netProfit / GROSS_REVENUE) * 100);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">การวิเคราะห์ต้นทุนและกำไร</h1>
          <p className="mt-1 text-sm text-stone-400">ภาพรวมต้นทุนและผลกำไรสุทธิ</p>
        </div>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="cursor-pointer rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-orange-400"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              เดือน{m}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-stone-900">รายละเอียดต้นทุน (Cost Breakdown)</p>

          <ul className="space-y-4">
            {COSTS.map(({ label, value, icon: Icon }) => (
              <li key={label} className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm text-stone-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Icon size={15} />
                  </span>
                  {label}
                </span>
                <span className="font-semibold text-stone-900">฿{value.toLocaleString()}.00</span>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-stone-100" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-700">ต้นทุนรวม (Total Costs)</span>
            <span className="text-lg font-bold text-orange-700">฿{totalCosts.toLocaleString()}.00</span>
          </div>
        </div>

        <div className="rounded-2xl bg-orange-700 p-6 text-white shadow-sm">
          <p className="text-sm text-orange-100">กำไรสุทธิ (Net Profit)</p>
          <p className="mt-1 text-3xl font-extrabold">฿{netProfit.toLocaleString()}.00</p>

          <div className="my-4 border-t border-orange-500/40" />

          <ul className="space-y-2 text-sm text-orange-50">
            <li className="flex justify-between">
              <span>ยอดขายรวม (Gross Rev)</span>
              <span>฿{GROSS_REVENUE.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between">
              <span>ต้นทุนขาย (COGS)</span>
              <span>-฿{COGS.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between font-semibold">
              <span>กำไรขั้นต้น (Gross Profit)</span>
              <span>฿{grossProfit.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between">
              <span>ต้นทุนคงที่ (Fixed Costs)</span>
              <span>-฿{FIXED_COSTS.toLocaleString()}.00</span>
            </li>
          </ul>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-orange-900/40">
              <div className="h-full rounded-full bg-white" style={{ width: `${margin}%` }} />
            </div>
            <p className="mt-1.5 text-right text-xs text-orange-100">อัตรากำไร {margin}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
