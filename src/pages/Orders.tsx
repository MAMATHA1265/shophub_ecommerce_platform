import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Store,
  Truck,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ShopCardSkeleton } from '../components/Skeleton';
import { useOrders } from '../context/OrderContext';
import type { OrderStatus } from '../types';
import { formatINR, formatOrderDate } from '../utils/format';

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    { icon: typeof Clock; className: string }
  > = {
    Placed: {
      icon: Clock,
      className: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    Packed: {
      icon: PackageCheck,
      className: 'border-sky-200 bg-sky-50 text-sky-800',
    },
    'Out for Delivery': {
      icon: Truck,
      className: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    },
    Delivered: {
      icon: CheckCircle2,
      className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    },
  };

  const { icon: Icon, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

export function Orders() {
  const { orders, loading } = useOrders();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="border-b border-zinc-200 pb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
          Order History
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Track live status and view receipts for your local ShopHub orders.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <ShopCardSkeleton />
            <ShopCardSkeleton />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50 px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Order ID</p>
                    <p className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Placed On</p>
                    <p className="font-medium text-zinc-800">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Total</p>
                    <p className="font-semibold text-zinc-900 tabular-nums">
                      {formatINR(order.total)}
                    </p>
                  </div>
                </div>

                <OrderStatusBadge status={order.status} />
              </div>

              <div className="divide-y divide-zinc-100 px-5">
                {order.shopGroups.map((group) => (
                  <div key={group.shopId} className="py-4">
                    <Link
                      to={`/shops/${group.shopId}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 hover:text-emerald-800"
                    >
                      <Store className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                      <span>{group.shopName}</span>
                    </Link>

                    <ul className="mt-2.5 space-y-1.5 text-sm">
                      {group.items.map((item) => (
                        <li
                          key={item.productId}
                          className="flex items-baseline justify-between gap-4 text-zinc-700"
                        >
                          <Link
                            to={`/products/${item.productId}`}
                            className="hover:text-emerald-800 hover:underline"
                          >
                            {item.quantity} × {item.name}{' '}
                            <span className="text-xs text-zinc-400">
                              ({item.unit})
                            </span>
                          </Link>
                          <span className="tabular-nums shrink-0 font-medium text-zinc-900">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 px-5 py-3 text-xs text-zinc-600">
                <span>
                  Deliver to: {order.address}, {order.city} – {order.pincode}
                </span>
                <Link
                  to={`/order-confirmation/${order.id}`}
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View Receipt
                </Link>
              </div>
            </article>
          ))
        ) : (
          <EmptyState
            icon={Package}
            title="No orders placed yet"
            description="Once you place an order from any local store, it will appear here with live delivery status."
            actionLabel="Start Shopping"
            actionTo="/shops"
          />
        )}
      </div>
    </main>
  );
}
