import { CartLine } from "@/lib/types";
import CartLineItem from "./CartLineItem";
import CartSummary from "./CartSummary";

export default function CartSidebar({
  cart,
  onUpdateQty,
  onUpdateNote,
  onClearAll,
  subtotal,
  tax,
  total,
  onCheckout,
}: {
  cart: CartLine[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onClearAll: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}) {
  return (
    <aside className="w-full shrink-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm lg:w-80">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-stone-900">รายการอาหาร</h2>
        {cart.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-medium text-stone-400 hover:text-red-500 cursor-pointer"
          >
            ลบทั้งหมด
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-400">
          ยังไม่มีรายการอาหารในตะกร้า
        </p>
      ) : (
        <div className="space-y-3">
          {cart.map((line) => (
            <CartLineItem key={line.item.id} line={line} onUpdateQty={onUpdateQty} onUpdateNote={onUpdateNote}/>
          ))}
        </div>
      )}

      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        disabled={cart.length === 0}
        onCheckout={onCheckout}
      />
    </aside>
  );
}