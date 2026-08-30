import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-5 pb-24 pt-24 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
        <Compass className="size-5" />
      </span>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">Nothing at this address.</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        This listing may have been removed, or the link is off by a street or two.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        Back to all listings
      </Link>
    </main>
  );
}
