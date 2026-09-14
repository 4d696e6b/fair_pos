"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Package, Pencil, Store, Truck, Users } from "lucide-react";
import { getShopCosts, saveShopCosts } from "@/features/finance";
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
  const [draft, setDraft] = useState<Omit<ShopCosts, "shopId"> | null>(null);
  const [grossRevenue, setGrossRevenue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [nextCosts, orders] = await Promise.all([
      getShopCosts(storeId),
      listOrdersForShop(storeId),
    ]);
    setCosts(nextCosts);
    setDraft({
      boothRent: nextCosts.boothRent,
      wages: nextCosts.wages,
      ingredients: nextCosts.ingredients,
      misc: nextCosts.misc,
    });
    setGrossRevenue(
      orders
        .filter((order) => order.status === "completed" || order.status === "ready")
        .reduce((sum, order) => sum + order.total, 0),
    );
  };

  useEffect(() => {
    void load();
  }, [storeId]);

  if (!costs || !draft) {
    return <p className="text-sm text-stone-400">กำลังโหลดข้อมูลการเงิน...</p>;
  }

  const display = editing ? draft : costs;
  const totalCosts = display.boothRent + display.wages + display.ingredients + display.misc;
  const cogs = display.ingredients;
  const fixedCosts = display.boothRent + display.wages + display.misc;
  const grossProfit = grossRevenue - cogs;
  const netProfit = grossProfit - fixedCosts;
  const margin = grossRevenue ? Math.max(0, Math.round((netProfit / grossRevenue) * 100)) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveShopCosts(storeId, draft);
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-stone-900">การวิเคราะห์ต้นทุนและกำไร</h1>
          <p className="mt-1 text-sm text-stone-400">คำนวณจากออเดอร์ที่เสร็จสิ้นและต้นทุนร้านใน Firestore</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDraft({
                  boothRent: costs.boothRent,
                  wages: costs.wages,
                  ingredients: costs.ingredients,
                  misc: costs.misc,
                });
                setEditing(false);
              }}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-800"
            >
              ยกเลิก
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={saving}
              className="cursor-pointer rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกต้นทุน"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 hover:border-orange-200"
          >
            <Pencil size={14} />
            แก้ไขต้นทุน
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
          <p className="mb-4 font-bold text-stone-900">รายละเอียดต้นทุน (Cost Breakdown)</p>

          <ul className="space-y-4">
            {COST_META.map(({ key, label, icon: Icon }) => (
              <li key={key} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm text-stone-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Icon size={15} />
                  </span>
                  {label}
                </span>
                {editing ? (
                  <input
                    type="number"
                    min={0}
                    value={draft[key]}
                    onChange={(e) =>
                      setDraft((prev) =>
                        prev ? { ...prev, [key]: Number(e.target.value) || 0 } : prev,
                      )
                    }
                    className="w-32 rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-right text-sm font-semibold outline-none focus:border-orange-400"
                  />
                ) : (
                  <span className="font-semibold text-stone-900">
                    ฿{costs[key].toLocaleString()}.00
                  </span>
                )}
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
