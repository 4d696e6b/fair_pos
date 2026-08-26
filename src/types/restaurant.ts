import { MenuItem } from "./menu";
import { Order } from "./order";
import { Table } from "./table";

export interface Restaurant {
  id: string;
  ownerUserId: string;
  name: string;
  description: string;
  logo: string;
  menu: MenuItem[];
  phoneNumber: string;
  orders: Order[];
  tables: Table[];
  createdAt: Date;
  updatedAt: Date;
}