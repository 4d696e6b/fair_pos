import { CartLine, OrderType, ShopTable } from "@/lib/types";
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
  checkoutDisabled,
  checkoutLabel,
  orderType,
  onOrderTypeChange,
  tables,
  tableLabel,
  onTableLabelChange,
  allowDineIn,
  allowTakeaway,
}: {
  cart: CartLine[];
  onUpdateQty: (itemId: string, qty: number) => void;
  onUpdateNote: (itemId: string, note: string) => void;
  onClearAll: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
  checkoutLabel?: string;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  tables: ShopTable[];
  tableLabel: string;
  onTableLabelChange: (label: string) => void;
  allowDineIn: boolean;
  allowTakeaway: boolean;
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

      {allowDineIn || allowTakeaway ? (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            {allowTakeaway ? (
              <button
                type="button"
                onClick={() => onOrderTypeChange("takeaway")}
                className={
                  "flex-1 rounded-full px-3 py-1.5 text-xs font-medium " +
                  (orderType === "takeaway" ? "bg-orange-700 text-white" : "bg-stone-100 text-stone-600")
                }
              >
                รับกลับบ้าน
              </button>
            ) : null}
            {allowDineIn ? (
              <button
                type="button"
                onClick={() => onOrderTypeChange("dine-in")}
                className={
                  "flex-1 rounded-full px-3 py-1.5 text-xs font-medium " +
                  (orderType === "dine-in" ? "bg-orange-700 text-white" : "bg-stone-100 text-stone-600")
                }
              >
                ทานที่ร้าน
              </button>
            ) : null}
          </div>
          {orderType === "dine-in" ? (
            tables.length === 0 ? (
              <p className="text-xs text-stone-400">ร้านนี้ยังไม่ได้เพิ่มโต๊ะ</p>
            ) : (
              <select
                value={tableLabel}
                onChange={(e) => onTableLabelChange(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-orange-400"
              >
                <option value="">เลือกโต๊ะ</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.label}>
                    {table.label}
                  </option>
                ))}
              </select>
            )
          ) : null}
        </div>
      ) : null}

      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        disabled={Boolean(checkoutDisabled) || cart.length === 0}
        label={checkoutLabel}
        onCheckout={onCheckout}
      />
    </aside>
  );
}
