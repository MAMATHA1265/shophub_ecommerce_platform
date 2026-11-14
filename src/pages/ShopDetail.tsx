import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  PackageSearch,
  Search,
  Star,
  Truck,
  XCircle,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { DetailSkeleton, ProductCardSkeleton } from '../components/Skeleton';
import { SmartImage } from '../components/SmartImage';
import { getProducts, getShopById } from '../services/api';
import type { Product, Shop } from '../types';
import { formatINR } from '../utils/format';

export function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subCategory, setSubCategory] = useState('All');

  useEffect(() => {
    let active = true;
    async function load() {
      if (!shopId) return;
      setLoading(true);
      setSearch('');
      setSubCategory('All');
      const [shopRes, prodRes] = await Promise.all([
        getShopById(shopId),
        getProducts({ shopId }),
      ]);
      if (active) {
        setShop(shopRes);
        setProducts(prodRes);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [shopId]);

  const subCategories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.subCategory)));
    return ['All', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = subCategory === 'All' || p.subCategory === subCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, subCategory, search]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DetailSkeleton />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!shop) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title="Shop not found"
          description="We couldn't find the store you're looking for. It may have moved or been removed."
          actionLabel="Browse All Shops"
          actionTo="/shops"
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/shops"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to Shops</span>
      </Link>

      {/* Storefront Banner */}
      <section className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="grid items-stretch lg:grid-cols-12">
          <div className="relative h-56 bg-zinc-100 sm:h-64 lg:col-span-5 lg:h-auto">
            <SmartImage
              imageKey={shop.bannerKey}
              alt={`${shop.name} storefront banner`}
              fallbackLabel={shop.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    aria-hidden="true"
                    style={{ backgroundColor: shop.accentColor }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold text-white"
                  >
                    {shop.logoInitials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {shop.category} Storefront
                    </p>
                    <h1 className="font-display text-2xl font-bold text-zinc-900 sm:text-3xl">
                      {shop.name}
                    </h1>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    shop.isOpen
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {shop.isOpen ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                  )}
                  <span>{shop.isOpen ? `Open · ${shop.hours}` : `Closed · Opens ${shop.hours}`}</span>
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
                {shop.description}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-5 text-sm text-zinc-700 sm:grid-cols-3">
              <div className="flex items-center gap-2 tabular-nums">
                <Star
                  className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-zinc-900">
                    {shop.rating.toFixed(1)}
                  </strong>{' '}
                  <span className="text-zinc-500">({shop.reviewCount} reviews)</span>
                </span>
              </div>

              <div className="flex items-center gap-2 tabular-nums">
                <Clock className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                <span>Delivery in {shop.deliveryTime}</span>
              </div>

              <div className="flex items-center gap-2 tabular-nums">
                <Truck className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                <span>
                  {formatINR(shop.deliveryFee)} fee (free above{' '}
                  {formatINR(shop.freeDeliveryAbove)})
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              <span>{shop.address}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Inside-Shop Search & Sub-Category Filters */}
      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-display text-xl font-bold text-zinc-900">
            Store Catalog ({filteredProducts.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search in ${shop.name}...`}
              aria-label={`Search products in ${shop.name}`}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Shop product categories"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          {subCategories.map((cat) => {
            const active = subCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSubCategory(cat)}
                className={`min-h-[38px] rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-emerald-700 text-white'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showShopName={false}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageSearch}
              title="No matching items in this shop"
              description="Try clearing your search or selecting another product category."
              actionLabel="Show All Items"
              onAction={() => {
                setSearch('');
                setSubCategory('All');
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}
