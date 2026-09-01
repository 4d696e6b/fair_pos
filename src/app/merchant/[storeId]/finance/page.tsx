"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Store, Users, Package, Truck } from "lucide-react";
import { getShopCosts } from "@/features/finance";
import { listOrdersForShop } from "@/features/orders";
import type { ShopCosts } from "@/lib/types";

const COST_META = [
  { key: "boothRent" as const, label: "ค่าเช่าบูธ (Booth Rent)", icon: Store },
  { key: "wages" as const, label: "ค่าจ้างพนักงาน (Wages)", icon: Users },
  { key: "ingredients" as const, label: "วัตถุดิบ (Ingredients - COGS)", icon: Package },
  { key: "misc" as const, label: "ค่าขนส่งและอื่นๆ (Misc/Fixed)", icon: Truck },
];

export default function FinancePage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [costs, setCosts] = useState<ShopCosts | null>(null);
  const [grossRevenue, setGrossRevenue] = useState(0);

  useEffect(() => {
    void Promise.all([getShopCosts(storeId), listOrdersForShop(storeId)]).then(
      ([nextCosts, orders]) => {
        setCosts(nextCosts);
        setGrossRevenue(
          orders
            .filter((order) => order.status === "completed" || order.status === "ready")
            .reduce((sum, order) => sum + order.total, 0),
        );
      },
    );
  }, [storeId]);

  if (!costs) {
    return <p className="text-sm text-stone-400">กำลังโหลดข้อมูลการเงิน...</p>;
  }

  const totalCosts = costs.boothRent + costs.wages + costs.ingredients + costs.misc;
  const cogs = costs.ingredients;
  const fixedCosts = costs.boothRent + costs.wages + costs.misc;
  const grossProfit = grossRevenue - cogs;
  const netProfit = grossProfit - fixedCosts;
  const margin = grossRevenue ? Math.max(0, Math.round((netProfit / grossRevenue) * 100)) : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-stone-900">การวิเคราะห์ต้นทุนและกำไร</h1>
        <p className="mt-1 text-sm text-stone-400">คำนวณจากออเดอร์ที่เสร็จสิ้นและต้นทุนร้านใน Firestore</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-stone-900">รายละเอียดต้นทุน (Cost Breakdown)</p>

          <ul className="space-y-4">
            {COST_META.map(({ key, label, icon: Icon }) => (
              <li key={key} className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm text-stone-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Icon size={15} />
                  </span>
                  {label}
                </span>
                <span className="font-semibold text-stone-900">
                  ฿{costs[key].toLocaleString()}.00
                </span>
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
              <span>฿{grossRevenue.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between">
              <span>ต้นทุนขาย (COGS)</span>
              <span>-฿{cogs.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between font-semibold">
              <span>กำไรขั้นต้น (Gross Profit)</span>
              <span>฿{grossProfit.toLocaleString()}.00</span>
            </li>
            <li className="flex justify-between">
              <span>ต้นทุนคงที่ (Fixed Costs)</span>
              <span>-฿{fixedCosts.toLocaleString()}.00</span>
            </li>
          </ul>

          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-orange-900/40">
              <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(margin, 100)}%` }} />
            </div>
            <p className="mt-1.5 text-right text-xs text-orange-100">อัตรากำไร {margin}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
