import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-7 sm:px-8 lg:px-10 lg:pb-16 lg:pt-12">
      <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-border bg-card">
        <img
          src="/tbilisi-rental-hero.png"
          alt="Modern apartment overlooking Tbilisi at dusk"
          className="absolute inset-0 size-full object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,18,.97)_0%,rgba(7,9,18,.78)_38%,rgba(7,9,18,.2)_100%)]" />
        <div className="relative flex min-h-[460px] max-w-2xl flex-col justify-center gap-7 px-7 py-12 sm:px-12 lg:px-16">
          <div className="flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Updated hourly from Telegram
          </div>
          <h1 className="max-w-xl text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            Find your place in <span className="text-primary">Tbilisi.</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            One quiet feed of fresh apartment listings, aggregated every hour from the busiest
            Telegram rental channels.
          </p>
        </div>
      </div>
    </section>
  );
}
