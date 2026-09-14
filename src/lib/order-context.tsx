"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartLine, MenuItem } from "./types";

type OrderContextValue = {
  cart: CartLine[];
  addItem: (item: MenuItem) => void;
  updateQty: (itemId: string, qty: number) => void;
  updateNote: (itemId: string, note: string) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  taxRate: number;
  serviceChargeRate: number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({
  children,
  taxRate = 0,
  serviceChargeRate = 0,
}: {
  children: ReactNode;
  taxRate?: number;
  serviceChargeRate?: number;
}) {
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
  const tax = useMemo(
    () => Math.round(subtotal * (taxRate / 100) * 100) / 100,
    [subtotal, taxRate],
  );
  const serviceCharge = useMemo(
    () => Math.round(subtotal * (serviceChargeRate / 100) * 100) / 100,
    [subtotal, serviceChargeRate],
  );
  const total = useMemo(() => subtotal + tax + serviceCharge, [subtotal, tax, serviceCharge]);

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
        serviceCharge,
        total,
        taxRate,
        serviceChargeRate,
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
