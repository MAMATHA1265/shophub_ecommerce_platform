import { useState } from 'react';
import { Package } from 'lucide-react';
import { getMediaUrl } from '../data/media';

interface SmartImageProps {
  imageKey: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SmartImage({
  imageKey,
  alt,
  className = 'h-full w-full object-cover',
  fallbackLabel,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);
  const src = getMediaUrl(imageKey);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-100 to-zinc-200 p-4 text-zinc-500"
      >
        <Package className="h-7 w-7 text-zinc-400" aria-hidden="true" />
        <span className="line-clamp-2 text-center text-xs font-medium text-zinc-600">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
