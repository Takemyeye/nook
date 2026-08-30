export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span className="font-medium text-foreground">nook</span>
        <span>Listings aggregated from public Telegram channels, refreshed hourly.</span>
      </div>
    </footer>
  );
}
