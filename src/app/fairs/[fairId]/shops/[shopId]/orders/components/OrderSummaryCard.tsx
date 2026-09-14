"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type OrderLine = {
  item: {
    id: string;
    name: string;
    price: number;
  };
  qty: number;
  note?: string;
};

type OrderSummary = {
  id: string;
  queueNumber: string | number;
  lines: OrderLine[];
  subtotal: number;
  tax: number;
  serviceCharge?: number;
  total: number;
};

export default function OrderSummaryCard({
  orders,
  taxRate = 0,
  serviceChargeRate = 0,
}: {
  orders: OrderSummary[];
  taxRate?: number;
  serviceChargeRate?: number;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const isSingle = orders.length === 1;
  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);
  const showTax = taxRate > 0;
  const showService = serviceChargeRate > 0;

  const toggleOrder = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-stone-700">
        สรุปรายการ{" "}
        {isSingle ? `${orders[0].lines.length} รายการ` : `${orders.length} ออเดอร์`}
      </p>

      <div className="space-y-2.5">
        {orders.map((order) => {
          const isOpen = isSingle || openIds.has(order.id);

          return (
            <div
              key={order.id}
              className={isSingle ? "" : "overflow-hidden rounded-xl border border-stone-100"}
            >
              {isSingle ? null : (
                <button
                  type="button"
                  onClick={() => toggleOrder(order.id)}
                  className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left transition hover:bg-stone-50"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-orange-600">
                      คิว {order.queueNumber}
                    </span>
                    <span className="text-xs text-stone-400">
                      {order.lines.length} รายการ
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700">
                      ฿{order.total.toFixed(2)}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>
              )}

                <div className={isSingle ? "" : "border-t border-stone-100 px-3 pb-3 pt-3"}>
                  <ul className="space-y-3 text-sm text-stone-600">
                    {order.lines.map((line) => (
                      <li key={line.item.id} className="flex flex-col">
                        <div className="flex justify-between">
                          <span>
                            {line.qty}x {line.item.name}
                          </span>
                          <span>฿{(line.item.price * line.qty).toFixed(2)}</span>
                        </div>
                        {line.note ? (
                          <span className="text-xs text-stone-400">{line.note}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                {isOpen && (
                    isSingle ? null :(
                    <ul className="mt-3 space-y-1 text-xs text-stone-500">
                        <li className="flex justify-between">
                        <span>ยอดรวมสินค้า</span>
                        <span>฿{order.subtotal.toFixed(2)}</span>
                        </li>
                        {showTax ? (
                          <li className="flex justify-between">
                          <span>ภาษีมูลค่าเพิ่ม ({taxRate}%)</span>
                          <span>฿{order.tax.toFixed(2)}</span>
                          </li>
                        ) : null}
                        {showService ? (
                          <li className="flex justify-between">
                          <span>ค่าบริการ ({serviceChargeRate}%)</span>
                          <span>฿{(order.serviceCharge ?? 0).toFixed(2)}</span>
                          </li>
                        ) : null}
                        <li className="flex justify-between font-semibold text-stone-700">
                        <span>รวมออเดอร์นี้</span>
                        <span>฿{order.total.toFixed(2)}</span>
                        </li>
                    </ul>
                      )
                )}
                </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <div className="flex justify-between border-t border-stone-200 pt-3 text-sm text-stone-500">
          <span>ยอดรวมสินค้า</span>
          <span>฿{orders.reduce((sum, order) => sum + order.subtotal, 0).toFixed(2)}</span>
        </div>
        {showTax ? (
          <div className="flex justify-between py-3 text-sm text-stone-500">
            <span>ภาษีมูลค่าเพิ่ม ({taxRate}%)</span>
            <span>฿{orders.reduce((sum, order) => sum + order.tax, 0).toFixed(2)}</span>
          </div>
        ) : null}
        {showService ? (
          <div className="flex justify-between py-3 text-sm text-stone-500">
            <span>ค่าบริการ ({serviceChargeRate}%)</span>
            <span>฿{orders.reduce((sum, order) => sum + (order.serviceCharge ?? 0), 0).toFixed(2)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-900">
          <span>ยอดรวมทั้งหมด</span>
          <span>฿{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
