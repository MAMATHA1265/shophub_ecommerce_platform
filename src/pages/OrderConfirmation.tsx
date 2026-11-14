import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Receipt,
  Store,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { DetailSkeleton } from '../components/Skeleton';
import { getOrderById } from '../services/api';
import type { Order } from '../types';
import { formatINR, formatOrderDate } from '../utils/format';

export function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!orderId) return;
      setLoading(true);
      const found = await getOrderById(orderId);
      if (active) {
        setOrder(found);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <DetailSkeleton />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <EmptyState
          icon={Receipt}
          title="Order receipt not found"
          description="We could not locate that order confirmation in this browser's storage."
          actionLabel="Continue Shopping"
          actionTo="/shops"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 border-b border-zinc-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Order Confirmed
              </p>
              <h1 className="mt-0.5 font-display text-2xl font-bold text-zinc-900">
                Thank you, {order.customerName}!
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Placed on {formatOrderDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-50 px-4 py-2.5 text-left sm:text-right">
            <p className="text-xs text-zinc-500">Order ID</p>
            <p className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
              {order.id}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl bg-zinc-50 p-4 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            <div>
              <p className="font-semibold text-zinc-900">Delivering To</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">
                {order.customerName} · {order.phone}
                <br />
                {order.address}, {order.city} – {order.pincode}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
            <div>
              <p className="font-semibold text-zinc-900">
                Estimated Arrival: {order.estimatedDelivery}
              </p>
              <p className="mt-0.5 text-xs text-zinc-600">
                Payment: {order.paymentDetail ?? (order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment')}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Items */}
        <div className="mt-6 space-y-5">
          <h2 className="font-display text-base font-bold text-zinc-900">
            Items Ordered
          </h2>

          {order.shopGroups.map((group) => (
            <div
              key={group.shopId}
              className="rounded-xl border border-zinc-200 p-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-zinc-900">
                  <Store className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {group.shopName}
                </span>
                <span className="text-xs text-zinc-500 tabular-nums">
                  {group.deliveryFee === 0
                    ? 'Free Delivery'
                    : `Delivery ${formatINR(group.deliveryFee)}`}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {group.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-zinc-700">
                      {item.quantity} × {item.name}{' '}
                      <span className="text-xs text-zinc-400">({item.unit})</span>
                    </span>
                    <span className="tabular-nums font-medium text-zinc-900">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <dl className="mt-6 space-y-2 border-t border-zinc-200 pt-4 text-sm tabular-nums">
          <div className="flex justify-between text-zinc-600">
            <dt>Subtotal</dt>
            <dd>{formatINR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-zinc-600">
            <dt>Delivery Fee</dt>
            <dd>{order.deliveryFee === 0 ? 'Free' : formatINR(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-100 pt-2 text-base font-bold text-zinc-900">
            <dt>Total Paid</dt>
            <dd>{formatINR(order.total)}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            <span>View Order History</span>
          </Link>
          <Link
            to="/shops"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
