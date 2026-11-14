import type { ShopCategory } from '../types';

export const SHOP_CATEGORIES: Array<ShopCategory | 'All'> = [
  'All',
  'Grocery',
  'Fashion',
  'Electronics',
  'Home',
  'Beauty',
  'Books',
];

interface CategoryChipsProps {
  selected: ShopCategory | 'All';
  onSelect: (category: ShopCategory | 'All') => void;
  includeAll?: boolean;
}

export function CategoryChips({
  selected,
  onSelect,
  includeAll = true,
}: CategoryChipsProps) {
  const items = includeAll
    ? SHOP_CATEGORIES
    : SHOP_CATEGORIES.filter((c) => c !== 'All');

  return (
    <div
      role="tablist"
      aria-label="Shop categories"
      className="flex flex-wrap items-center gap-2"
    >
      {items.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category)}
            className={`min-h-[40px] rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              isActive
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
