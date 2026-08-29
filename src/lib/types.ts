export type FairCategory = "ตลาดนัด" | "ของกิน" | "ของใช้";

export type Fair = {
  id: string;
  name: string;
  dateRange: string;
  location: string;
  image: string;
  badge?: string;
  category: FairCategory;
};

export type Shop = {
  id: string;
  fairId: string;
  name: string;
  category: string;
  image: string;
  icon: string;
  boothNumber: string;
};

export type MenuCategory = "เมนูหลัก" | "ของทานเล่น" | "เครื่องดื่ม" | "ของหวาน";

export type MenuItem = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  category: MenuCategory;
};

export type CartLine = {
  item: MenuItem;
  qty: number;
  note?: string;
};

export type OrderStatus = "received" | "preparing" | "ready";

export type Order = {
  id: string;
  queueNumber: string;
  refCode: string;
  fairId: string;
  shopId: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: string;
};
