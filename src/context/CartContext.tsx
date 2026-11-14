import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getProductByIdSync, getShopByIdSync } from '../services/api';
import type { CartItemData, Product, Shop } from '../types';
import { useToast } from './ToastContext';

const CART_STORAGE_KEY = 'shophub_cart';

export interface HydratedCartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface CartShopGroup {
  shop: Shop;
  items: HydratedCartItem[];
  subtotal: number;
  deliveryFee: number;
  freeDeliveryRemaining: number;
}

interface CartContextValue {
  items: CartItemData[];
  groupedByShop: CartShopGroup[];
  totalItems: number;
  subtotal: number;
  totalDeliveryFee: number;
  grandTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadStoredCart(): CartItemData[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItemData[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>(loadStoredCart);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [items]);

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      if (product.stock <= 0) {
        showToast('Out of stock', {
          description: `${product.name} is currently unavailable.`,
          variant: 'error',
        });
        return;
      }

      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stock);
          return prev.map((i) =>
            i.productId === product.id ? { ...i, quantity: nextQty } : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            shopId: product.shopId,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      });

      showToast('Added to cart', {
        description: `${quantity} × ${product.name}`,
        variant: 'success',
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    const product = getProductByIdSync(productId);
    const maxStock = product ? product.stock : 99;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, maxStock) }
          : i
      )
    );
  }, []);

  const removeFromCart = useCallback(
    (productId: string) => {
      const product = getProductByIdSync(productId);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      if (product) {
        showToast('Removed from cart', {
          description: product.name,
          variant: 'info',
        });
      }
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const groupedByShop = useMemo<CartShopGroup[]>(() => {
    const map = new Map<string, HydratedCartItem[]>();

    for (const entry of items) {
      const product = getProductByIdSync(entry.productId);
      if (!product) continue;
      const list = map.get(product.shopId) ?? [];
      list.push({
        product,
        quantity: entry.quantity,
        lineTotal: product.price * entry.quantity,
      });
      map.set(product.shopId, list);
    }

    const groups: CartShopGroup[] = [];
    for (const [shopId, shopItems] of map.entries()) {
      const shop = getShopByIdSync(shopId);
      if (!shop) continue;
      const subtotal = shopItems.reduce((sum, item) => sum + item.lineTotal, 0);
      const qualifiesFree = subtotal >= shop.freeDeliveryAbove;
      const deliveryFee = qualifiesFree ? 0 : shop.deliveryFee;
      const freeDeliveryRemaining = Math.max(0, shop.freeDeliveryAbove - subtotal);
      groups.push({
        shop,
        items: shopItems,
        subtotal,
        deliveryFee,
        freeDeliveryRemaining,
      });
    }

    return groups;
  }, [items]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => groupedByShop.reduce((sum, g) => sum + g.subtotal, 0),
    [groupedByShop]
  );

  const totalDeliveryFee = useMemo(
    () => groupedByShop.reduce((sum, g) => sum + g.deliveryFee, 0),
    [groupedByShop]
  );

  const grandTotal = subtotal + totalDeliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        groupedByShop,
        totalItems,
        subtotal,
        totalDeliveryFee,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
