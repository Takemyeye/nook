import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { ChannelBadge } from "@/components/channel-badge";
import { Gallery } from "@/components/gallery";
import { Price } from "@/components/price";
import { SpecBadges } from "@/components/spec-badges";
import { TelegramButton } from "@/components/telegram-button";
import { getListing } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListing(id);

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-4 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to listings
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <div>
          <Gallery imageUrls={listing.imageUrls} title={listing.title} />
          <div className="mt-8">
            <p className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {listing.district ? `${listing.district}, Tbilisi` : "Tbilisi"}
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="size-4" />
                Posted {formatDate(listing.postedAt)}
              </span>
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {listing.title}
            </h1>
            <div className="mt-5">
              <SpecBadges listing={listing} />
            </div>
          </div>
          {listing.description && (
            <div className="mt-10 border-t border-border pt-8">
              <h2 className="text-xl font-semibold tracking-tight">From the Telegram post</h2>
              <p className="mt-4 max-w-2xl whitespace-pre-line leading-7 text-muted-foreground">
                {listing.description}
              </p>
            </div>
          )}
        </div>
        <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-6">
          <Price price={listing.price} currency={listing.currency} size="lg" />
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <span>Source channel</span>
              <ChannelBadge channel={listing.channel} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Posted</span>
              <span className="font-medium text-foreground">{formatDate(listing.postedAt)}</span>
            </div>
          </div>
          <div className="mt-6">
            <TelegramButton sourceUrl={listing.sourceUrl} />
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            nook only aggregates listings. To ask questions or arrange a viewing, contact the
            poster directly in the original Telegram post.
          </p>
        </aside>
      </div>
    </main>
  );
}
