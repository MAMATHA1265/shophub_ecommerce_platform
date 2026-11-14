import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getOrders, placeOrder, type PlaceOrderInput } from '../services/api';
import type { Order } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextValue {
  orders: Order[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  submitOrder: (input: Omit<PlaceOrderInput, 'userId'>) => Promise<Order>;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const list = await getOrders(user.id);
      setOrders(list);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const submitOrder = useCallback(
    async (input: Omit<PlaceOrderInput, 'userId'>) => {
      const userId = user?.id ?? 'guest-shopper';
      const created = await placeOrder({ ...input, userId });
      setOrders((prev) => [created, ...prev]);
      return created;
    },
    [user]
  );

  return (
    <OrderContext.Provider
      value={{ orders, loading, refreshOrders, submitOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return ctx;
}
