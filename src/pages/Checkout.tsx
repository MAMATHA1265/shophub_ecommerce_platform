import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import type { OrderShopSummary, PaymentMethod } from '../types';
import { formatINR } from '../utils/format';

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  upiId?: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    groupedByShop,
    subtotal,
    totalDeliveryFee,
    grandTotal,
    clearCart,
  } = useCart();
  const { submitOrder } = useOrders();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (groupedByShop.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out"
          description="Add products from local stores to your cart before proceeding to checkout."
          actionLabel="Explore Shops"
          actionTo="/shops"
        />
      </main>
    );
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!address.trim() || address.trim().length < 8) {
      nextErrors.address = 'Please enter a complete street address and house/flat number.';
    }
    if (!city.trim()) {
      nextErrors.city = 'Please enter your city.';
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      nextErrors.pincode = 'Enter a valid 6-digit PIN code.';
    }
    if (paymentMethod === 'online' && upiId.trim().length > 0 && !upiId.includes('@')) {
      nextErrors.upiId = 'Enter a valid UPI ID (e.g. name@upi) or leave blank for card.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const shopGroups: OrderShopSummary[] = groupedByShop.map((g) => ({
        shopId: g.shop.id,
        shopName: g.shop.name,
        subtotal: g.subtotal,
        deliveryFee: g.deliveryFee,
        items: g.items.map((item) => ({
          productId: item.product.id,
          shopId: g.shop.id,
          shopName: g.shop.name,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
          imageKey: item.product.imageKey,
        })),
      }));

      const order = await submitOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        paymentMethod,
        paymentDetail:
          paymentMethod === 'online'
            ? upiId.trim()
              ? `UPI (${upiId.trim()})`
              : 'Mock Online Card / NetBanking'
            : 'Cash on Delivery',
        subtotal,
        deliveryFee: totalDeliveryFee,
        total: grandTotal,
        shopGroups,
      });

      clearCart();
      showToast('Order placed successfully', {
        description: `Order ID ${order.id}`,
        variant: 'success',
      });
      navigate(`/order-confirmation/${order.id}`, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to Cart</span>
      </Link>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-zinc-900">
        Checkout
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Complete your delivery details and choose your preferred payment method.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid gap-8 lg:grid-cols-12"
      >
        {/* Left: Delivery & Payment Form */}
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              1. Delivery Address
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label
                  htmlFor="checkout-name"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Mehta"
                  aria-invalid={Boolean(errors.name)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="checkout-phone"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Mobile Number
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9845012345"
                  aria-invalid={Boolean(errors.phone)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 tabular-nums focus:border-emerald-700 focus:outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="checkout-address"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Street Address & Landmark
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 4B, Green Residency, 12th Main Road, Indiranagar"
                  aria-invalid={Boolean(errors.address)}
                  className="mt-1.5 w-full rounded-xl border border-zinc-300 bg-white p-3.5 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-sm font-medium text-zinc-700"
                >
                  City
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-invalid={Boolean(errors.city)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-pincode"
                  className="block text-sm font-medium text-zinc-700"
                >
                  PIN Code
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="560038"
                  aria-invalid={Boolean(errors.pincode)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 tabular-nums focus:border-emerald-700 focus:outline-none"
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>
                )}
              </div>
            </div>
          </section>

          {/* Payment Options */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              2. Payment Method
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 h-4 w-4 text-emerald-700 focus:ring-emerald-700"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-zinc-900">
                    <Banknote className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    <span>Cash on Delivery</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">
                    Pay via cash or UPI QR at your doorstep upon arrival.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  paymentMethod === 'online'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="mt-1 h-4 w-4 text-emerald-700 focus:ring-emerald-700"
                />
                <div>
                  <div className="flex items-center gap-2 font-medium text-zinc-900">
                    <CreditCard className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    <span>Online Payment (Mock)</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">
                    Instant simulated UPI or card authorization.
                  </p>
                </div>
              </label>
            </div>

            {paymentMethod === 'online' && (
              <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <label
                  htmlFor="checkout-upi"
                  className="block text-xs font-medium text-zinc-700"
                >
                  UPI ID (optional for demo)
                </label>
                <input
                  id="checkout-upi"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okaxis"
                  className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
                />
                {errors.upiId && (
                  <p className="mt-1 text-xs text-red-600">{errors.upiId}</p>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Order Summary
            </h2>

            <div className="mt-4 divide-y divide-zinc-100">
              {groupedByShop.map((group) => (
                <div key={group.shop.id} className="py-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    <span>{group.shop.name}</span>
                    <span className="tabular-nums">
                      {group.deliveryFee === 0
                        ? 'Free delivery'
                        : `+${formatINR(group.deliveryFee)} delivery`}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item.product.id}
                        className="flex items-baseline justify-between gap-3 text-sm"
                      >
                        <span className="truncate text-zinc-700">
                          {item.quantity} × {item.product.name}
                        </span>
                        <span className="tabular-nums shrink-0 font-medium text-zinc-900">
                          {formatINR(item.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <dl className="mt-2 space-y-2.5 border-t border-zinc-200 pt-4 text-sm tabular-nums">
              <div className="flex items-center justify-between text-zinc-600">
                <dt>Items Subtotal</dt>
                <dd className="font-medium text-zinc-900">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <dt>Delivery Total</dt>
                <dd className="font-medium text-zinc-900">
                  {totalDeliveryFee === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    formatINR(totalDeliveryFee)
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-zinc-100 pt-3">
                <dt className="text-base font-semibold text-zinc-900">
                  Amount Payable
                </dt>
                <dd className="font-display text-2xl font-bold text-zinc-900">
                  {formatINR(grandTotal)}
                </dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>
                {submitting
                  ? 'Placing Order...'
                  : `Place Order · ${formatINR(grandTotal)}`}
              </span>
            </button>

            {!user && (
              <p className="mt-3 text-center text-xs text-zinc-500">
                Tip:{' '}
                <Link to="/login" className="font-medium text-emerald-700 underline">
                  Sign in
                </Link>{' '}
                to save this order to your Order History.
              </p>
            )}
          </div>
        </aside>
      </form>
    </main>
  );
}
