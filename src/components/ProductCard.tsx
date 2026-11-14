import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getShopByIdSync } from '../services/api';
import type { Product } from '../types';
import { formatINR } from '../utils/format';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
  showShopName?: boolean;
}

export function ProductCard({ product, showShopName = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const shop = getShopByIdSync(product.shopId);
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <Link
          to={`/products/${product.id}`}
          className="block h-full w-full"
          aria-label={`View details for ${product.name}`}
        >
          <SmartImage
            imageKey={product.imageKey}
            alt={product.name}
            fallbackLabel={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        {product.discount > 0 && !outOfStock && (
          <span className="absolute left-3 top-3 rounded-md bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">
            {product.discount}% Off
          </span>
        )}

        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-md bg-zinc-900/85 px-2 py-0.5 text-xs font-medium text-white">
            Out of Stock
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-zinc-700 shadow-sm backdrop-blur-xs transition-colors hover:bg-white hover:text-red-600"
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
          <span className="truncate font-medium uppercase tracking-wide">
            {showShopName && shop ? shop.name : product.subCategory}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 tabular-nums text-zinc-700">
            <Star
              className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
              aria-hidden="true"
            />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
          </span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="mt-1.5 line-clamp-2 font-display text-base font-semibold leading-snug text-zinc-900 hover:text-emerald-800"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-xs text-zinc-500">{product.unit}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-baseline gap-2 tabular-nums">
            <span className="text-base font-bold text-zinc-900">
              {formatINR(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="text-xs text-zinc-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product, 1)}
            className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              outOfStock
                ? 'cursor-not-allowed bg-zinc-100 text-zinc-400'
                : 'bg-emerald-700 text-white hover:bg-emerald-800'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{outOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
