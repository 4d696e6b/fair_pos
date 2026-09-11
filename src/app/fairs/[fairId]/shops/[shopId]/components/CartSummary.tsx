export default function CartSummary({
  subtotal,
  tax,
  serviceCharge,
  total,
  taxRate,
  serviceChargeRate,
  disabled,
  onCheckout,
  label,
}: {
  subtotal: number;
  tax: number;
  serviceCharge?: number;
  total: number;
  taxRate?: number;
  serviceChargeRate?: number;
  disabled: boolean;
  onCheckout: () => void;
  label?: string;
}) {
  const showTax = (taxRate ?? 0) > 0;
  const showService = (serviceChargeRate ?? 0) > 0;

  return (
    <>
      <div className="mt-5 space-y-1 border-t border-stone-200 pt-4 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>ยอดรวม</span>
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
        {showTax ? (
          <div className="flex justify-between text-stone-500">
            <span>ภาษี ({taxRate}%)</span>
            <span>฿{tax.toFixed(2)}</span>
          </div>
        ) : null}
        {showService ? (
          <div className="flex justify-between text-stone-500">
            <span>ค่าบริการ ({serviceChargeRate}%)</span>
            <span>฿{(serviceCharge ?? 0).toFixed(2)}</span>
          </div>
        ) : null}
        <div className="flex justify-between pt-1 text-base font-bold text-stone-900">
          <span>ยอดสุทธิ</span>
          <span>฿{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={disabled}
        className="mt-4 w-full rounded-full bg-orange-700 py-3 text-sm font-semibold text-white transition hover:bg-orange-800 cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
      >
        {label ?? "เพิ่มออเดอร์"}
      </button>
    </>
  );
}
