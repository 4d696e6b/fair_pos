import { MenuItem } from "./menu";

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItem: MenuItem;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}