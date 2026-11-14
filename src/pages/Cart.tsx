import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Store, Truck } from 'lucide-react';
import { CartItem } from '../components/CartItem';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

export function Cart() {
  const {
    groupedByShop,
    totalItems,
    subtotal,
    totalDeliveryFee,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (groupedByShop.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added any products yet. Explore local neighborhood shops to start your order."
          actionLabel="Browse Local Shops"
          actionTo="/shops"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-zinc-600 tabular-nums">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} across{' '}
            {groupedByShop.length}{' '}
            {groupedByShop.length === 1 ? 'local shop' : 'local shops'}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-zinc-500 hover:text-red-600"
        >
          Clear Cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Grouped by Shop */}
        <div className="space-y-6 lg:col-span-8">
          {groupedByShop.map((group) => (
            <section
              key={group.shop.id}
              aria-label={`Items from ${group.shop.name}`}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-4">
                <Link
                  to={`/shops/${group.shop.id}`}
                  className="flex items-center gap-3 hover:text-emerald-800"
                >
                  <div
                    aria-hidden="true"
                    style={{ backgroundColor: group.shop.accentColor }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-xs font-bold text-white"
                  >
                    {group.shop.logoInitials}
                  </div>
                  <div>
                    <h2 className="font-display text-base font-semibold text-zinc-900">
                      {group.shop.name}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {group.shop.neighborhood} · Est. {group.shop.deliveryTime}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Truck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {group.deliveryFee === 0 ? (
                    <span className="text-emerald-700">
                      Free delivery unlocked
                    </span>
                  ) : (
                    <span className="text-zinc-600 tabular-nums">
                      Add {formatINR(group.freeDeliveryRemaining)} more for free
                      delivery
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-zinc-100 px-5">
                {group.items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-5 py-3 text-sm tabular-nums">
                <span className="text-zinc-600">
                  Shop subtotal ({group.items.length}{' '}
                  {group.items.length === 1 ? 'product' : 'products'})
                </span>
                <span className="font-semibold text-zinc-900">
                  {formatINR(group.subtotal)}
                </span>
              </div>
            </section>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Order Summary
            </h2>

            <dl className="mt-5 space-y-3 border-b border-zinc-100 pb-5 text-sm tabular-nums">
              <div className="flex items-center justify-between text-zinc-600">
                <dt>Subtotal</dt>
                <dd className="font-medium text-zinc-900">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <dt>Delivery Fees ({groupedByShop.length} {groupedByShop.length === 1 ? 'shop' : 'shops'})</dt>
                <dd className="font-medium text-zinc-900">
                  {totalDeliveryFee === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    formatINR(totalDeliveryFee)
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between tabular-nums">
              <span className="text-base font-semibold text-zinc-900">Total</span>
              <span className="font-display text-2xl font-bold text-zinc-900">
                {formatINR(grandTotal)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/shops"
              className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Store className="h-4 w-4" aria-hidden="true" />
              <span>Add Items from Other Shops</span>
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
