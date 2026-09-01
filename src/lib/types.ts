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

export type SellingStyle = "takeaway" | "dine-in" | "both";

export type Shop = {
  id: string;
  fairId: string;
  ownerUserId?: string;
  name: string;
  category: string;
  image: string;
  icon: string;
  boothNumber: string;
  description?: string;
  location?: string;
  taxRate?: number;
  serviceCharge?: number;
  sellingStyle?: SellingStyle;
};

export type MenuCategory = "เมนูหลัก" | "ของทานเล่น" | "เครื่องดื่ม" | "ของหวาน";

export type MenuItem = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  image: string;
  category: MenuCategory;
  description?: string;
  isAvailable?: boolean;
};

export type CartLine = {
  item: MenuItem;
  qty: number;
  note?: string;
};

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "dine-in" | "takeaway";

export type Order = {
  id: string;
  queueNumber: string;
  refCode: string;
  fairId: string;
  shopId: string;
  userId?: string;
  tableLabel?: string;
  type: OrderType;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: string;
};

export type TableStatus = "empty" | "occupied" | "awaiting-payment";

export type ShopTable = {
  id: string;
  shopId: string;
  label: string;
  status: TableStatus;
  total?: number;
  seatedMinutes?: number;
};

export type StaffStatus = "active" | "inactive";

export type StaffMember = {
  id: string;
  shopId: string;
  name: string;
  employeeId: string;
  role: string;
  status: StaffStatus;
};

export type ShopCosts = {
  shopId: string;
  boothRent: number;
  wages: number;
  ingredients: number;
  misc: number;
};
