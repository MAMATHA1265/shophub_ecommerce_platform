import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, CheckCircle2, XCircle } from 'lucide-react';
import type { Shop } from '../types';
import { SmartImage } from './SmartImage';

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      to={`/shops/${shop.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <SmartImage
          imageKey={shop.bannerKey}
          alt={`${shop.name} storefront`}
          fallbackLabel={shop.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            style={{ backgroundColor: shop.accentColor }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold text-white"
          >
            {shop.logoInitials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-display text-base font-semibold text-zinc-900 group-hover:text-emerald-800">
                {shop.name}
              </h3>
              <span
                className={`inline-flex shrink-0 items-center gap-1 text-xs font-medium whitespace-nowrap ${
                  shop.isOpen ? 'text-emerald-700' : 'text-zinc-500'
                }`}
              >
                {shop.isOpen ? (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{shop.isOpen ? 'Open' : 'Closed'}</span>
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-zinc-600 tabular-nums">
              <span className="font-medium text-zinc-800">{shop.category}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Star
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                  aria-hidden="true"
                />
                <span className="font-medium text-zinc-800">
                  {shop.rating.toFixed(1)}
                </span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                <span>{shop.deliveryTime}</span>
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-600">
          {shop.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          <span className="truncate">
            {shop.neighborhood}, {shop.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
