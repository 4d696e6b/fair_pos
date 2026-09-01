"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartLine, MenuItem } from "./types";

const TAX_RATE = 0.07;

type OrderContextValue = {
  cart: CartLine[];
  addItem: (item: MenuItem) => void;
  updateQty: (itemId: string, qty: number) => void;
  updateNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);

  const addItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.item.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line
        );
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (itemId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((line) => line.item.id !== itemId);
      return prev.map((line) =>
        line.item.id === itemId ? { ...line, qty } : line
      );
    });
  };

  const updateNote = (itemId: string, note: string) => {
    setCart((prev) =>
      prev.map((line) =>
        line.item.id === itemId ? { ...line, note: note || undefined } : line
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.item.price * line.qty, 0),
    [cart]
  );
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE * 100) / 100, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  return (
    <OrderContext.Provider
      value={{
        cart,
        addItem,
        updateQty,
        updateNote,
        clearCart,
        subtotal,
        tax,
        total,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}
