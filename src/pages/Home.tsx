import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Store, Package } from 'lucide-react';
import { CategoryChips } from '../components/CategoryChips';
import { ProductCard } from '../components/ProductCard';
import { ShopCard } from '../components/ShopCard';
import { ProductCardSkeleton, ShopCardSkeleton } from '../components/Skeleton';
import { SmartImage } from '../components/SmartImage';
import { getProducts, getShops } from '../services/api';
import type { Product, Shop, ShopCategory } from '../types';
import { formatINR } from '../utils/format';

export function Home() {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [allShops, allProducts] = await Promise.all([
        getShops({ sortBy: 'rating' }),
        getProducts(),
      ]);
      if (active) {
        setShops(allShops);
        setProducts(allProducts);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const searchSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { shops: [], products: [] };
    return {
      shops: shops
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.neighborhood.toLowerCase().includes(q)
        )
        .slice(0, 3),
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.subCategory.toLowerCase().includes(q)
        )
        .slice(0, 4),
    };
  }, [query, shops, products]);

  const displayedShops = useMemo(() => {
    const filtered =
      selectedCategory === 'All'
        ? shops.filter((s) => s.isFeatured)
        : shops.filter((s) => s.category === selectedCategory);
    return filtered.slice(0, 4);
  }, [shops, selectedCategory]);

  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products.filter((p) => p.isTrending).slice(0, 8);
    }
    return products
      .filter((p) => p.shopCategory === selectedCategory)
      .slice(0, 8);
  }, [products, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/shops?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shops');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="grid items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Local Neighborhood Marketplace
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-zinc-900 text-balance sm:text-4xl lg:text-5xl">
              Shop curated local stores, delivered in minutes.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
              Browse independent grocers, handloom boutiques, audio studios,
              botanical apothecaries, and neighborhood bookshops across your city.
            </p>

            {/* Unified Hero Search */}
            <div className="relative mt-7 max-w-xl">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="flex flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
                    placeholder="Search shops, linen shirts, Arabica coffee, books..."
                    aria-label="Search local shops and products"
                    className="h-12 w-full rounded-xl border border-zinc-300 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-emerald-700 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {searchFocused &&
                query.trim().length > 0 &&
                (searchSuggestions.shops.length > 0 ||
                  searchSuggestions.products.length > 0) && (
                  <div className="absolute left-0 right-0 top-14 z-30 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
                    {searchSuggestions.shops.length > 0 && (
                      <div className="border-b border-zinc-100 p-2">
                        <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Shops
                        </p>
                        {searchSuggestions.shops.map((shop) => (
                          <Link
                            key={shop.id}
                            to={`/shops/${shop.id}`}
                            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                          >
                            <span className="flex items-center gap-2 font-medium">
                              <Store className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                              {shop.name}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {shop.category} · {shop.neighborhood}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchSuggestions.products.length > 0 && (
                      <div className="p-2">
                        <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Products
                        </p>
                        {searchSuggestions.products.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                          >
                            <span className="flex items-center gap-2 truncate font-medium">
                              <Package className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                              <span className="truncate">{product.name}</span>
                            </span>
                            <span className="tabular-nums ml-3 shrink-0 text-xs font-semibold text-zinc-900">
                              {formatINR(product.price)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="relative min-h-[240px] bg-zinc-100 lg:col-span-5">
            <SmartImage
              imageKey="hero-market"
              alt="Sunlit interior of a curated local neighborhood market"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section aria-label="Browse by category" className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-display text-lg font-semibold text-zinc-900">
            Browse Categories
          </h2>
          <Link
            to={
              selectedCategory === 'All'
                ? '/shops'
                : `/shops?category=${encodeURIComponent(selectedCategory)}`
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0"
          >
            <span>
              {selectedCategory === 'All'
                ? 'Explore all 8 local shops'
                : `View all ${selectedCategory} shops`}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-4">
          <CategoryChips
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Featured Shops */}
      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-blue-700">
              {selectedCategory === 'All'
                ? 'Featured Shops'
                : `${selectedCategory} Shops`}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Trusted neighborhood stores with verified ratings and transparent delivery times.
            </p>
          </div>
          <Link
            to="/shops"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0"
          >
            <span>All Shops</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ShopCardSkeleton key={i} />)
            : displayedShops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      </section>

      {/* Trending Products */}
      <section className="mt-14">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-blue-700">
              {selectedCategory === 'All'
                ? 'Trending Products'
                : `Popular in ${selectedCategory}`}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Handpicked local bestsellers ready for same-day doorstep delivery.
            </p>
          </div>
          <Link
            to={
              selectedCategory === 'All'
                ? '/shops'
                : `/shops?category=${encodeURIComponent(selectedCategory)}`
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap shrink-0"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>
    </main>
  );
}
