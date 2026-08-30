"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({
  urls,
  title,
  index,
  onClose,
  onNavigate,
}: {
  urls: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const previous = (index - 1 + urls.length) % urls.length;
  const next = (index + 1) % urls.length;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(previous);
      if (event.key === "ArrowRight") onNavigate(next);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate, previous, next]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — photo viewer`}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-sm text-muted-foreground">
          {index + 1} / {urls.length}
        </span>
        <button
          type="button"
          aria-label="Close photo viewer"
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full border border-border bg-card transition hover:border-primary hover:text-primary"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
        <img
          src={urls[index]}
          alt={`${title} — photo ${index + 1}`}
          onClick={(event) => event.stopPropagation()}
          className="max-h-full max-w-full rounded-2xl border border-border object-contain"
        />
        {urls.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(previous);
              }}
              className="absolute left-4 grid size-11 place-items-center rounded-full border border-border bg-card/90 transition hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(event) => {
                event.stopPropagation();
                onNavigate(next);
              }}
              className="absolute right-4 grid size-11 place-items-center rounded-full border border-border bg-card/90 transition hover:border-primary hover:text-primary"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
