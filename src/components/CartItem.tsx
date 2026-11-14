import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { HydratedCartItem } from '../context/CartContext';
import { formatINR } from '../utils/format';
import { SmartImage } from './SmartImage';

interface CartItemProps {
  item: HydratedCartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const { product, quantity, lineTotal } = item;

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <Link
          to={`/products/${product.id}`}
          className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100"
        >
          <SmartImage
            imageKey={product.imageKey}
            alt={product.name}
            fallbackLabel={product.name}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${product.id}`}
            className="font-display text-sm font-semibold text-zinc-900 hover:text-emerald-800 sm:text-base"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-zinc-500">
            {product.unit} · {formatINR(product.price)} each
          </p>
          {quantity >= product.stock && (
            <p className="mt-1 text-xs font-medium text-amber-700">
              Max available stock reached ({product.stock})
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            aria-label={`Decrease quantity of ${product.name}`}
            className="flex h-10 w-10 items-center justify-center text-zinc-700 transition-colors hover:bg-zinc-200/70 rounded-l-lg"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span
            aria-label={`Quantity ${quantity}`}
            className="tabular-nums min-w-[2.25rem] text-center text-sm font-semibold text-zinc-900"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
            aria-label={`Increase quantity of ${product.name}`}
            className="flex h-10 w-10 items-center justify-center text-zinc-700 transition-colors hover:bg-zinc-200/70 disabled:cursor-not-allowed disabled:opacity-40 rounded-r-lg"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="tabular-nums min-w-[4.5rem] text-right text-sm font-bold text-zinc-900 sm:text-base">
            {formatINR(lineTotal)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
