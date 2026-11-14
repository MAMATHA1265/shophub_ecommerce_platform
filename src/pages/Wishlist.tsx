import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { getProductByIdSync } from '../services/api';
import type { Product } from '../types';

export function Wishlist() {
  const { wishlistIds, clearWishlist } = useWishlist();

  const savedProducts = useMemo(() => {
    return wishlistIds
      .map((id) => getProductByIdSync(id))
      .filter((p): p is Product => Boolean(p));
  }, [wishlistIds]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900">
            Saved Wishlist
          </h1>
          <p className="mt-1 text-sm text-zinc-600 tabular-nums">
            {savedProducts.length}{' '}
            {savedProducts.length === 1 ? 'saved product' : 'saved products'}
          </p>
        </div>

        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-sm font-medium text-zinc-500 hover:text-red-600"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      <div className="mt-8">
        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Tap the heart icon on any product while browsing local shops to save items for later."
            actionLabel="Discover Products"
            actionTo="/shops"
          />
        )}
      </div>
    </main>
  );
}
