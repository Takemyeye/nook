import { Send } from "lucide-react";

export function ChannelBadge({ channel }: { channel: string }) {
  const handle = channel.startsWith("@") ? channel : `@${channel}`;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
      <Send className="size-3 text-primary" />
      {handle}
    </span>
  );
}
