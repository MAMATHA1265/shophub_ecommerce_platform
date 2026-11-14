import shopsData from '../data/shops.json';
import productsData from '../data/products.json';
import type {
  Order,
  OrderShopSummary,
  PaymentMethod,
  Product,
  Shop,
  ShopCategory,
  User,
} from '../types';

/**
 * Simulates network latency for realistic skeleton loading states.
 * When connecting a real REST/GraphQL backend later, replace these
 * implementations with fetch/axios calls to your API endpoints.
 */
const SIMULATED_DELAY_MS = 140;

const delay = (ms: number = SIMULATED_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  USERS: 'shophub_users',
  CURRENT_USER: 'shophub_user',
  ORDERS: 'shophub_orders',
} as const;

export interface ShopQueryFilters {
  category?: ShopCategory | 'All';
  minRating?: number;
  openNow?: boolean;
  search?: string;
  sortBy?: 'rating' | 'delivery' | 'reviews';
}

export interface ProductQueryFilters {
  shopId?: string;
  category?: ShopCategory | 'All';
  subCategory?: string;
  search?: string;
  trendingOnly?: boolean;
}

export interface PlaceOrderInput {
  userId: string;
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
  shopGroups: OrderShopSummary[];
}

/**
 * Fetch all shops with optional filtering and sorting.
 */
export async function getShops(filters: ShopQueryFilters = {}): Promise<Shop[]> {
  await delay();
  let list = [...(shopsData as Shop[])];

  if (filters.category && filters.category !== 'All') {
    list = list.filter((s) => s.category === filters.category);
  }

  if (filters.minRating && filters.minRating > 0) {
    list = list.filter((s) => s.rating >= filters.minRating!);
  }

  if (filters.openNow) {
    list = list.filter((s) => s.isOpen);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.neighborhood.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (filters.sortBy === 'delivery') {
    list.sort((a, b) => a.deliveryMinutesMin - b.deliveryMinutesMin);
  } else if (filters.sortBy === 'reviews') {
    list.sort((a, b) => b.reviewCount - a.reviewCount);
  } else {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}

/**
 * Fetch a single shop by ID.
 */
export async function getShopById(shopId: string): Promise<Shop | null> {
  await delay(100);
  const found = (shopsData as Shop[]).find((s) => s.id === shopId);
  return found ?? null;
}

/**
 * Synchronous shop lookup helper for cart/product rendering.
 */
export function getShopByIdSync(shopId: string): Shop | undefined {
  return (shopsData as Shop[]).find((s) => s.id === shopId);
}

/**
 * Fetch products with optional shop, category, or search filters.
 */
export async function getProducts(
  filters: ProductQueryFilters = {}
): Promise<Product[]> {
  await delay();
  let list = [...(productsData as Product[])];

  if (filters.shopId) {
    list = list.filter((p) => p.shopId === filters.shopId);
  }

  if (filters.category && filters.category !== 'All') {
    list = list.filter((p) => p.shopCategory === filters.category);
  }

  if (filters.subCategory && filters.subCategory !== 'All') {
    list = list.filter((p) => p.subCategory === filters.subCategory);
  }

  if (filters.trendingOnly) {
    list = list.filter((p) => p.isTrending);
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.shopCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return list;
}

/**
 * Fetch a single product by ID.
 */
export async function getProductById(productId: string): Promise<Product | null> {
  await delay(100);
  const found = (productsData as Product[]).find((p) => p.id === productId);
  return found ?? null;
}

/**
 * Synchronous product lookup helper for cart & wishlist hydration.
 */
export function getProductByIdSync(productId: string): Product | undefined {
  return (productsData as Product[]).find((p) => p.id === productId);
}

/**
 * Seed realistic sample orders once for demo user so Order History looks meaningful.
 */
function ensureSeedOrders(userId: string): Order[] {
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  let allOrders: Order[] = raw ? JSON.parse(raw) : [];

  if (userId === 'user-demo' && !allOrders.some((o) => o.userId === 'user-demo')) {
    const demoOrders: Order[] = [
      {
        id: 'SH-2026-410829',
        userId: 'user-demo',
        createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
        status: 'Out for Delivery',
        customerName: 'Aarav Mehta',
        phone: '9845012345',
        address: '42, 12th Main Road, HAL 2nd Stage',
        city: 'Bengaluru',
        pincode: '560038',
        paymentMethod: 'online',
        paymentDetail: 'UPI (aarav@okaxis)',
        subtotal: 1430,
        deliveryFee: 0,
        total: 1430,
        estimatedDelivery: 'Arriving in 15-20 min',
        shopGroups: [
          {
            shopId: 'shop-1',
            shopName: 'Greenleaf Organics',
            subtotal: 890,
            deliveryFee: 0,
            items: [
              {
                productId: 'prod-102',
                shopId: 'shop-1',
                shopName: 'Greenleaf Organics',
                name: 'Cold-Pressed Extra Virgin Olive Oil',
                price: 890,
                quantity: 1,
                unit: '750 ml',
                imageKey: 'grocery-fresh',
              },
            ],
          },
          {
            shopId: 'shop-2',
            shopName: 'Nilgiri Roast & Pantry',
            subtotal: 540,
            deliveryFee: 0,
            items: [
              {
                productId: 'prod-201',
                shopId: 'shop-2',
                shopName: 'Nilgiri Roast & Pantry',
                name: 'Chikmagalur Single-Estate Arabica Tin',
                price: 540,
                quantity: 1,
                unit: '250 g',
                imageKey: 'grocery-pantry',
              },
            ],
          },
        ],
      },
      {
        id: 'SH-2026-398114',
        userId: 'user-demo',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        status: 'Delivered',
        customerName: 'Aarav Mehta',
        phone: '9845012345',
        address: '42, 12th Main Road, HAL 2nd Stage',
        city: 'Bengaluru',
        pincode: '560038',
        paymentMethod: 'cod',
        subtotal: 2490,
        deliveryFee: 0,
        total: 2490,
        estimatedDelivery: 'Delivered on time',
        shopGroups: [
          {
            shopId: 'shop-3',
            shopName: 'Kora Loom Studio',
            subtotal: 2490,
            deliveryFee: 0,
            items: [
              {
                productId: 'prod-301',
                shopId: 'shop-3',
                shopName: 'Kora Loom Studio',
                name: 'Handloom Sage Linen Relaxed Shirt',
                price: 2490,
                quantity: 1,
                unit: 'Sizes S - XL',
                imageKey: 'fashion-linen',
              },
            ],
          },
        ],
      },
    ];
    allOrders = [...demoOrders, ...allOrders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));
  }

  return allOrders;
}

/**
 * Fetch order history for a user from localStorage.
 */
export async function getOrders(userId: string): Promise<Order[]> {
  await delay(120);
  const allOrders = ensureSeedOrders(userId);
  return allOrders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Fetch a specific order by ID.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay(80);
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const allOrders: Order[] = raw ? JSON.parse(raw) : [];
  return allOrders.find((o) => o.id === orderId) ?? null;
}

/**
 * Place a new order and persist to localStorage.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  await delay(220);
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  const newOrder: Order = {
    id: `SH-2026-${randomCode}`,
    userId: input.userId,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    pincode: input.pincode,
    paymentMethod: input.paymentMethod,
    paymentDetail: input.paymentDetail,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    estimatedDelivery: '30-45 minutes',
    shopGroups: input.shopGroups,
  };

  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  const existing: Order[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([newOrder, ...existing]));

  return newOrder;
}

interface StoredUserRecord extends User {
  password: string;
}

/**
 * Mock user registration stored in localStorage.
 */
export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<User> {
  await delay(160);
  const normalizedEmail = email.trim().toLowerCase();
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: StoredUserRecord[] = raw ? JSON.parse(raw) : [];

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: StoredUserRecord = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
  };

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));
  const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Mock user login against localStorage records (or built-in demo shopper).
 */
export async function loginUser(email: string, password: string): Promise<User> {
  await delay(160);
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === 'aarav@shophub.in' && password === 'demo1234') {
    const demoUser: User = {
      id: 'user-demo',
      name: 'Aarav Mehta',
      email: 'aarav@shophub.in',
      phone: '9845012345',
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoUser));
    return demoUser;
  }

  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: StoredUserRecord[] = raw ? JSON.parse(raw) : [];
  const matched = users.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!matched) {
    throw new Error('Invalid email or password.');
  }

  const sessionUser: User = { id: matched.id, name: matched.name, email: matched.email };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
  return sessionUser;
}

export function getCurrentUserSync(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function logoutUserSync(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}
