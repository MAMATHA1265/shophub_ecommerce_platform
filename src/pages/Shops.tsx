import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Store } from 'lucide-react';
import { CategoryChips } from '../components/CategoryChips';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { ShopCard } from '../components/ShopCard';
import { ShopCardSkeleton } from '../components/Skeleton';
import { getProducts, getShops } from '../services/api';
import type { Product, Shop, ShopCategory } from '../types';

const VALID_CATEGORIES: Array<ShopCategory | 'All'> = [
  'All',
  'Grocery',
  'Fashion',
  'Electronics',
  'Home',
  'Beauty',
  'Books',
];

export function Shops() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category') as ShopCategory | null;
  const initialCategory: ShopCategory | 'All' =
    initialCategoryParam && VALID_CATEGORIES.includes(initialCategoryParam)
      ? initialCategoryParam
      : 'All';
  const initialQuery = searchParams.get('q') ?? '';

  const [category, setCategory] = useState<ShopCategory | 'All'>(initialCategory);
  const [search, setSearch] = useState(initialQuery);
  const [minRating, setMinRating] = useState<number>(0);
  const [openNow, setOpenNow] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'reviews'>('rating');

  const [shops, setShops] = useState<Shop[]>([]);
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramCat = searchParams.get('category') as ShopCategory | null;
    if (paramCat && VALID_CATEGORIES.includes(paramCat)) {
      setCategory(paramCat);
    } else if (!paramCat) {
      setCategory('All');
    }
    const paramQ = searchParams.get('q') ?? '';
    setSearch(paramQ);
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [filteredShops, filteredProducts] = await Promise.all([
        getShops({
          category,
          minRating,
          openNow,
          search,
          sortBy,
        }),
        search.trim().length > 0
          ? getProducts({
              category,
              search,
            })
          : Promise.resolve([]),
      ]);

      if (active) {
        setShops(filteredShops);
        setMatchingProducts(filteredProducts);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [category, minRating, openNow, search, sortBy]);

  const updateUrlParams = (nextCat: ShopCategory | 'All', nextQ: string) => {
    const params = new URLSearchParams();
    if (nextCat !== 'All') params.set('category', nextCat);
    if (nextQ.trim()) params.set('q', nextQ.trim());
    setSearchParams(params, { replace: true });
  };

  const handleCategorySelect = (nextCat: ShopCategory | 'All') => {
    setCategory(nextCat);
    updateUrlParams(nextCat, search);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateUrlParams(category, value);
  };

  const resetFilters = () => {
    setCategory('All');
    setSearch('');
    setMinRating(0);
    setOpenNow(false);
    setSortBy('rating');
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Local Shops Directory
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600">
            Discover independent neighborhood stores by category, rating, and delivery speed.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Filter shops or products..."
            aria-label="Filter shops or products"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Chips + Filter Controls */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <CategoryChips selected={category} onSelect={handleCategorySelect} />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              className="h-4 w-4 text-zinc-400"
              aria-hidden="true"
            />
            <label htmlFor="rating-filter" className="sr-only">
              Minimum rating
            </label>
            <select
              id="rating-filter"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:border-emerald-700 focus:outline-none"
            >
              <option value={0}>All Ratings</option>
              <option value={4.7}>4.7+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>

          <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <input
              type="checkbox"
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-700"
            />
            <span className="whitespace-nowrap">Open Now</span>
          </label>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-shops" className="sr-only">
              Sort shops
            </label>
            <select
              id="sort-shops"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'rating' | 'delivery' | 'reviews')
              }
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:border-emerald-700 focus:outline-none"
            >
              <option value="rating">Sort: Top Rated</option>
              <option value="delivery">Sort: Fastest Delivery</option>
              <option value="reviews">Sort: Most Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
        <p className="tabular-nums">
          Showing {shops.length} {shops.length === 1 ? 'shop' : 'shops'}
          {search.trim() ? ` matching “${search.trim()}”` : ''}
        </p>
        {(category !== 'All' || minRating > 0 || openNow || search.trim()) && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-medium text-emerald-700 hover:text-emerald-800"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Shop Grid */}
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Store}
            title="No shops match your filters"
            description="Try clearing your search query, switching categories, or toggling off the Open Now filter."
            actionLabel="Reset Filters"
            onAction={resetFilters}
          />
        )}
      </div>

      {/* Matching Products when Search Query is Active */}
      {!loading && search.trim().length > 0 && matchingProducts.length > 0 && (
        <section className="mt-14 border-t border-zinc-200 pt-10">
          <h2 className="font-display text-xl font-bold text-zinc-900">
            Matching Products ({matchingProducts.length})
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            Products across local stores matching “{search.trim()}”.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {matchingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
