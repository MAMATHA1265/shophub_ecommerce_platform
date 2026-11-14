import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Heart,
  Minus,
  PackageSearch,
  Plus,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Zap,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ProductCard } from '../components/ProductCard';
import { DetailSkeleton } from '../components/Skeleton';
import { SmartImage } from '../components/SmartImage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { getProductById, getProducts, getShopByIdSync } from '../services/api';
import type { Product } from '../types';
import { formatINR } from '../utils/format';

export function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!productId) return;
      setLoading(true);
      setSelectedImageIndex(0);
      setQuantity(1);
      const item = await getProductById(productId);
      if (item && active) {
        setProduct(item);
        const sameShop = await getProducts({ shopId: item.shopId });
        if (active) {
          setRelatedProducts(
            sameShop.filter((p) => p.id !== item.id).slice(0, 4)
          );
        }
      } else if (active) {
        setProduct(null);
      }
      if (active) setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          description="This product is no longer available or the link may be incorrect."
          actionLabel="Explore Shops"
          actionTo="/shops"
        />
      </main>
    );
  }

  const shop = getShopByIdSync(product.shopId);
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const gallery =
    product.galleryKeys.length > 0 ? product.galleryKeys : [product.imageKey];
  const activeImageKey = gallery[selectedImageIndex] ?? product.imageKey;

  const handleBuyNow = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-zinc-900">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/shops" className="hover:text-zinc-900">
          Shops
        </Link>
        {shop && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/shops/${shop.id}`} className="hover:text-zinc-900">
              {shop.name}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="truncate font-medium text-zinc-800">{product.name}</span>
      </nav>

      {/* Main 2-Column PDP Layout */}
      <div className="grid gap-10 lg:grid-cols-12">
        {/* Left: Sticky Image Gallery */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-white">
              <SmartImage
                imageKey={activeImageKey}
                alt={`${product.name} view ${selectedImageIndex + 1}`}
                fallbackLabel={product.name}
                className="h-full w-full object-cover"
              />
              {product.discount > 0 && (
                <span className="absolute left-4 top-4 rounded-lg bg-emerald-700 px-3 py-1 text-xs font-semibold text-white tabular-nums">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map((imgKey, idx) => {
                const isSelected = idx === selectedImageIndex;
                return (
                  <button
                    key={`${imgKey}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Show image ${idx + 1} of ${product.name}`}
                    className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-700 ring-2 ring-emerald-700/20'
                        : 'border-zinc-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SmartImage
                      imageKey={imgKey}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            {shop && (
              <Link
                to={`/shops/${shop.id}`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 hover:text-emerald-800"
              >
                <Store className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{shop.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-500">{shop.neighborhood}</span>
              </Link>
            )}

            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600 tabular-nums">
              <span className="inline-flex items-center gap-1 font-semibold text-zinc-900">
                <Star
                  className="h-4 w-4 fill-amber-400 text-amber-500"
                  aria-hidden="true"
                />
                {product.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.reviewCount} verified reviews</span>
              <span aria-hidden="true">·</span>
              <span>{product.unit}</span>
            </div>

            {/* Pricing */}
            <div className="mt-6 flex flex-wrap items-baseline gap-3 border-y border-zinc-100 py-5 tabular-nums">
              <span className="font-display text-3xl font-bold text-zinc-900">
                {formatINR(product.price)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-zinc-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">
                    You save {formatINR(product.originalPrice - product.price)} (
                    {product.discount}%)
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-5 flex items-center gap-2 text-sm font-medium">
              {outOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-red-600">
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                  Out of Stock — Check back soon
                </span>
              ) : lowStock ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Low Stock — Only {product.stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quantity + Actions */}
            <div className="mt-6 space-y-4">
              {!outOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-zinc-700">
                    Quantity
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-11 w-11 items-center justify-center rounded-l-lg text-zinc-700 hover:bg-zinc-200/70 disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="tabular-nums min-w-[2.5rem] text-center text-sm font-semibold text-zinc-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                      className="flex h-11 w-11 items-center justify-center rounded-r-lg text-zinc-700 hover:bg-zinc-200/70 disabled:opacity-40"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => addToCart(product, quantity)}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={handleBuyNow}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400"
                >
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  <span>Buy Now</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={wishlisted}
                className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`}
                  aria-hidden="true"
                />
                <span>
                  {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
            </div>

            {shop && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600">
                <Truck className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-zinc-900">
                    Delivered in {shop.deliveryTime} from {shop.neighborhood}
                  </p>
                  <p className="mt-0.5">
                    Delivery fee {formatINR(shop.deliveryFee)} · Free above{' '}
                    {formatINR(shop.freeDeliveryAbove)}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-zinc-100 pt-6">
              <h2 className="font-display text-base font-semibold text-zinc-900">
                About this product
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {product.description}
              </p>

              <ul className="mt-4 space-y-2">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-zinc-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* More from this Shop */}
      {relatedProducts.length > 0 && shop && (
        <section className="mt-16 border-t border-zinc-200 pt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-zinc-900">
              More from {shop.name}
            </h2>
            <Link
              to={`/shops/${shop.id}`}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Visit Storefront
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} showShopName={false} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
