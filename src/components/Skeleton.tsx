export function ShopCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-zinc-200" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
          </div>
        </div>
        <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-100" />
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
    >
      <div className="aspect-[4/3] w-full animate-pulse bg-zinc-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-200" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-200" />
          <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-8 lg:grid-cols-2">
      <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-zinc-200" />
      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-zinc-200" />
        <div className="h-6 w-28 animate-pulse rounded bg-zinc-200" />
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-11 w-48 animate-pulse rounded-lg bg-zinc-200 pt-4" />
      </div>
    </div>
  );
}
