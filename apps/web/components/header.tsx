import Link from "next/link";
import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="group flex items-center gap-3 rounded-xl"
        aria-label="nook home"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition group-hover:shadow-[0_0_32px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]">
          <Building2 className="size-4" />
        </span>
        <span className="text-lg font-semibold tracking-tight">nook</span>
      </Link>
      <p className="hidden text-sm text-muted-foreground sm:block">
        Rentals in Tbilisi, fresh from Telegram
      </p>
    </header>
  );
}
