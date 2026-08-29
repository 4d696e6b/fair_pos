"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartLine, MenuItem, Order } from "./types";

const TAX_RATE = 0.07;

type OrderContextValue = {
  cart: CartLine[];
  addItem: (item: MenuItem) => void;
  updateQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  order: Order | null;
  placeOrder: (fairId: string, shopId: string, boothNumber: string) => Order;
};

const OrderContext = createContext<OrderContextValue | null>(null);

function randomQueueNumber() {
  const n = Math.floor(Math.random() * 900) + 100;
  return `A${n}`;
}

function randomRefCode() {
  const digits = Math.floor(Math.random() * 90000) + 10000;
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const suffix =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];
  return `REF-${digits}-${suffix}`;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

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

  const clearCart = () => setCart([]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.item.price * line.qty, 0),
    [cart]
  );
  const tax = useMemo(() => Math.round(subtotal * TAX_RATE * 100) / 100, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const placeOrder = (fairId: string, shopId: string, boothNumber: string) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      queueNumber: randomQueueNumber(),
      refCode: randomRefCode(),
      fairId,
      shopId,
      lines: cart,
      subtotal,
      tax,
      total,
      status: "preparing",
      createdAt: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estimatedMinutes: "5 - 10 นาที",
    };
    setOrder(newOrder);
    clearCart();
    return newOrder;
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addItem,
        updateQty,
        clearCart,
        subtotal,
        tax,
        total,
        order,
        placeOrder,
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
