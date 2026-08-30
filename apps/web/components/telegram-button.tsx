import { Send } from "lucide-react";

export function TelegramButton({ sourceUrl }: { sourceUrl: string }) {
  return (
    <a
      href={sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] transition hover:brightness-110 hover:shadow-[0_0_40px_color-mix(in_oklab,var(--color-primary)_50%,transparent)] active:scale-[0.98]"
    >
      <Send className="size-4" />
      Open in Telegram
    </a>
  );
}
