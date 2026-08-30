export default function CartSummary({
  subtotal,
  tax,
  total,
  disabled,
  onCheckout,
}: {
  subtotal: number;
  tax: number;
  total: number;
  disabled: boolean;
  onCheckout: () => void;
}) {
  return (
    <>
      <div className="mt-5 space-y-1 border-t border-stone-100 pt-4 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>ยอดรวม</span>
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>ภาษี</span>
          <span>฿{tax.toFixed(2)}</span>
        </div>
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
        ชำระเงิน
      </button>
    </>
  );
}