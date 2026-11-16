import { useState } from "react";
import { Sprout } from "lucide-react";

interface SitePhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  captionTitle?: string;
  captionText?: string;
  fallbackLabel?: string;
}

export function SitePhoto({
  src,
  alt,
  className = "",
  imgClassName = "",
  captionTitle,
  captionText,
  fallbackLabel,
}: SitePhotoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`group relative overflow-hidden rounded-2xl border border-primary/15 bg-secondary ${className}`}
    >
      {!failed ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center bg-gradient-to-br from-secondary via-surface to-gold-soft p-6 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Sprout className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-medium text-primary">{fallbackLabel || alt}</p>
        </div>
      )}

      {(captionTitle || captionText) && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-12 text-white">
          {captionTitle && <p className="text-sm font-semibold leading-snug tracking-tight">{captionTitle}</p>}
          {captionText && <p className="mt-0.5 text-xs text-white/85">{captionText}</p>}
        </figcaption>
      )}
    </figure>
  );
}
