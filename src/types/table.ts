export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}