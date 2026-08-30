"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type StoreCategory = "เมนูหลัก" | "ของทานเล่น" | "เครื่องดื่ม" | "ของหวาน";

export type Store = {
  id: string;
  name: string;
  category: StoreCategory;
  description?: string;
  createdAt: string;
};

type StoreContextValue = {
  stores: Store[];
  createStore: (input: {
    name: string;
    category: StoreCategory;
    description?: string;
  }) => Store;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);

  const createStore: StoreContextValue["createStore"] = ({
    name,
    category,
    description,
  }) => {
    const newStore: Store = {
      id: crypto.randomUUID(),
      name,
      category,
      description,
      createdAt: new Date().toLocaleDateString("th-TH"),
    };
    setStores((prev) => [...prev, newStore]);
    return newStore;
  };

  return (
    <StoreContext.Provider value={{ stores, createStore }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
