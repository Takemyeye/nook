"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Lightbox } from "./lightbox";

function GalleryButton({
  onClick,
  label,
  className,
  children,
}: {
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Gallery({ imageUrls, title }: { imageUrls: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [cover, ...rest] = imageUrls;

  if (!cover) {
    return (
      <div className="grid h-[320px] w-full place-items-center rounded-3xl border border-border bg-card text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <ImageOff className="size-8" />
          <span className="text-sm">No photos in this post</span>
        </div>
      </div>
    );
  }

  const thumbnails = rest.slice(0, 4);
  const hidden = rest.length - thumbnails.length;

  return (
    <div className="flex flex-col gap-3">
      <GalleryButton onClick={() => setOpenIndex(0)} label={`Open photo 1 of ${imageUrls.length}`} className="rounded-3xl">
        <img
          src={cover}
          alt={title}
          className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[460px]"
        />
      </GalleryButton>
      {rest.length === 1 && (
        <GalleryButton onClick={() => setOpenIndex(1)} label={`Open photo 2 of ${imageUrls.length}`}>
          <img
            src={rest[0]}
            alt={`${title} — photo 2`}
            loading="lazy"
            className="aspect-[2.4] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        </GalleryButton>
      )}
      {rest.length > 1 && (
        <div className={`grid gap-3 ${thumbnails.length < 4 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
          {thumbnails.map((url, index) => {
            const isLast = index === thumbnails.length - 1;
            return (
              <GalleryButton
                key={url}
                onClick={() => setOpenIndex(index + 1)}
                label={`Open photo ${index + 2} of ${imageUrls.length}`}
              >
                <img
                  src={url}
                  alt={`${title} — photo ${index + 2}`}
                  loading="lazy"
                  className="aspect-[1.2] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                {isLast && hidden > 0 && (
                  <span className="absolute inset-0 grid place-items-center bg-background/60 text-sm font-semibold backdrop-blur-[2px]">
                    +{hidden} more
                  </span>
                )}
              </GalleryButton>
            );
          })}
        </div>
      )}
      {openIndex !== null && (
        <Lightbox
          urls={imageUrls}
          title={title}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
