export type ShopCategory =
  | 'Grocery'
  | 'Fashion'
  | 'Electronics'
  | 'Home'
  | 'Beauty'
  | 'Books';

export type OrderStatus =
  | 'Placed'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered';

export type PaymentMethod = 'cod' | 'online';

export interface Shop {
  id: string;
  name: string;
  logoInitials: string;
  accentColor: string;
  category: ShopCategory;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryMinutesMin: number;
  deliveryFee: number;
  freeDeliveryAbove: number;
  isOpen: boolean;
  isFeatured: boolean;
  address: string;
  neighborhood: string;
  city: string;
  description: string;
  bannerKey: string;
  hours: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  subCategory: string;
  shopCategory: ShopCategory;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  stock: number;
  unit: string;
  imageKey: string;
  galleryKeys: string[];
  description: string;
  highlights: string[];
  isTrending: boolean;
}

export interface CartItemData {
  productId: string;
  shopId: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderItem {
  productId: string;
  shopId: string;
  shopName: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  imageKey: string;
}

export interface OrderShopSummary {
  shopId: string;
  shopName: string;
  subtotal: number;
  deliveryFee: number;
  items: OrderItem[];
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  paymentDetail?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: string;
  shopGroups: OrderShopSummary[];
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'error';
}
