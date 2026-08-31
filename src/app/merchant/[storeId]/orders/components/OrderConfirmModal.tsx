"use client";

import { AlertTriangle, Check, X } from "lucide-react";

export type OrderConfirmAction = { orderId: string; queue: string; type: "complete" | "cancel" } | null;

export default function OrderConfirmModal({
  action,
  onClose,
  onConfirm,
}: {
  action: OrderConfirmAction;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!action) return null;

  const isCancel = action.type === "cancel";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-xl animate-popUp"
      >
        <button
          onClick={onClose}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-stone-400 transition hover:text-stone-700"
        >
          <X size={18} />
        </button>

        <div
          className={
            "mx-auto flex h-14 w-14 items-center justify-center rounded-full " +
            (isCancel ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600")
          }
        >
          {isCancel ? <AlertTriangle size={26} /> : <Check size={26} />}
        </div>

        <h2 className="mt-4 text-xl font-bold text-stone-900">
          {isCancel ? "ยกเลิกออเดอร์นี้?" : "ยืนยันออเดอร์เสร็จสิ้น?"}
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          {isCancel
            ? `ออเดอร์ ${action.queue} จะถูกยกเลิกและไม่สามารถย้อนกลับได้`
            : `ยืนยันว่าออเดอร์ ${action.queue} จัดทำเสร็จเรียบร้อยแล้ว`}
        </p>

        <div className="mx-auto my-5 h-px w-16 bg-orange-400" />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-full border border-stone-200 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
          >
            กลับไป
          </button>
          <button
            onClick={onConfirm}
            className={
              "flex-1 cursor-pointer rounded-full py-3 text-sm font-semibold text-white transition " +
              (isCancel ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700")
            }
          >
            {isCancel ? "ยกเลิกออเดอร์" : "ทำเสร็จแล้ว"}
          </button>
        </div>
      </div>
    </div>
  );
}
