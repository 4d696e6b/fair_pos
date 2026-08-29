import { Fair, MenuItem, Shop } from "./types";

export const FAIRS: Fair[] = [
  {
    id: "chiangrak",
    name: "ตลาดนัดเชียงราก",
    dateRange: "15 - 20 ส.ค. 68",
    location: "Thammasat University",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop",
    badge: "กำลังจอง",
    category: "ตลาดนัด",
  },
  {
    id: "tu-fair",
    name: "TU Fair",
    dateRange: "4 - 16 พ.ย. 69",
    location: "Thammasat University",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop",
    category: "ตลาดนัด",
  },
  {
    id: "soi-joo",
    name: "ซอยจุ๊ 67",
    dateRange: "23 - 35 ก.ย. 69",
    location: "Thammasat University",
    image:
      "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop",
    category: "ของกิน",
  },
];

export const RECOMMENDED_SHOPS = [
  { id: "taco-haven", name: "Taco Haven", category: "อาหารตะวันตก", icon: "🌮" },
  { id: "noodle-ninja", name: "Noodle Ninja", category: "อาหารไทย", icon: "🍜" },
  { id: "fresh-squeeze", name: "Fresh Squeeze", category: "เครื่องดื่ม", icon: "🍹" },
  { id: "sweet-sawa", name: "Sweet Sawa", category: "ของหวาน", icon: "🍧" },
];

export const SHOPS: Shop[] = [
  {
    id: "nai-jod",
    fairId: "chiangrak",
    name: "ร้านกะเพรานายจ้อด",
    category: "อาหารไทย",
    icon: "🍳",
    boothNumber: "A-08",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "winter-cafe",
    fairId: "chiangrak",
    name: "Winter Café",
    category: "เครื่องดื่ม",
    icon: "☕",
    boothNumber: "B-03",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "burger-artisan",
    fairId: "chiangrak",
    name: "Burger Artisan",
    category: "อาหารตะวันตก",
    icon: "🍔",
    boothNumber: "A-12",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "juice-bar",
    fairId: "chiangrak",
    name: "ร้านน้ำผลไม้สด",
    category: "เครื่องดื่ม",
    icon: "🍊",
    boothNumber: "C-05",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: "kaprao-moo", shopId: "nai-jod", name: "ข้าวกะเพราหมู", price: 60, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&auto=format&fit=crop" },
  { id: "kaprao-nuea", shopId: "nai-jod", name: "ข้าวกะเพราเนื้อ", price: 60, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=400&auto=format&fit=crop" },
  { id: "khao-na-nuea", shopId: "nai-jod", name: "ข้าวหน้าเนื้อ", price: 80, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
  { id: "khao-pad", shopId: "nai-jod", name: "ข้าวผัด", price: 50, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop" },
  { id: "pad-thai-goong", shopId: "nai-jod", name: "ผัดไทยกุ้งสด", price: 60, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=400&auto=format&fit=crop" },
  { id: "poo-pad-pong", shopId: "nai-jod", name: "ปูผัดผงกะหรี่", price: 70, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=400&auto=format&fit=crop" },
  { id: "muek-pad-khai-kem", shopId: "nai-jod", name: "หมึกผัดไข่เค็ม", price: 70, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1625938144870-42b6c7a4d0e1?q=80&w=400&auto=format&fit=crop" },
  { id: "tuan-saep", shopId: "nai-jod", name: "เต๋าแซ่บ", price: 80, category: "เมนูหลัก", image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=400&auto=format&fit=crop" },
  { id: "kai-jeaw", shopId: "nai-jod", name: "ไข่เจียวหมูสับ", price: 40, category: "ของทานเล่น", image: "https://images.unsplash.com/photo-1607103058027-4c5b0e1a3f4c?q=80&w=400&auto=format&fit=crop" },
  { id: "por-pia", shopId: "nai-jod", name: "ปอเปี๊ยะทอด", price: 45, category: "ของทานเล่น", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" },
  { id: "cha-yen", shopId: "nai-jod", name: "ชาไทยเย็น", price: 35, category: "เครื่องดื่ม", image: "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=400&auto=format&fit=crop" },
  { id: "nam-manao", shopId: "nai-jod", name: "น้ำมะนาว", price: 30, category: "เครื่องดื่ม", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=400&auto=format&fit=crop" },
  { id: "khao-niao-mamuang", shopId: "nai-jod", name: "ข้าวเหนียวมะม่วง", price: 60, category: "ของหวาน", image: "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=400&auto=format&fit=crop" },
  { id: "bua-loy", shopId: "nai-jod", name: "บัวลอยไข่หวาน", price: 40, category: "ของหวาน", image: "https://images.unsplash.com/photo-1631206753348-db44968fd440?q=80&w=400&auto=format&fit=crop" },
];

export function getFair(fairId: string) {
  return FAIRS.find((f) => f.id === fairId);
}

export function getShop(shopId: string) {
  return SHOPS.find((s) => s.id === shopId);
}

export function getShopsForFair(fairId: string) {
  return SHOPS.filter((s) => s.fairId === fairId);
}

export function getMenuForShop(shopId: string) {
  return MENU_ITEMS.filter((m) => m.shopId === shopId);
}
