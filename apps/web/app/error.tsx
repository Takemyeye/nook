"use client";

import { RefreshCcw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-5 pb-24 pt-24 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
        <RefreshCcw className="size-5" />
      </span>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">Something went sideways.</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        We couldn&apos;t load the listings right now. The backend may be waking up — give it a
        moment and try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        Try again
      </button>
    </main>
  );
}
