export enum MenuItemCategory {
  FOOD = 'food',
  DRINK = 'drink',
  SNACK = 'snack',
  DESSERT = 'dessert',
  OTHER = 'other',
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuItemCategory;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}