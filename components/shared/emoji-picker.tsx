"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_EMOJIS = [
  "🎬", "🎥", "📸", "🎨", "🎵", "📁",
  "💼", "🚀", "✨", "📈", "🏆", "💡",
  "📝", "🎯", "🔥", "🌱", "🏠", "❤️",
];

export function EmojiPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (emoji: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-9 gap-1">
        {PRESET_EMOJIS.map((e) => (
          <button
            key={e}
            onClick={() => onChange(value === e ? undefined : e)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg text-base transition-colors hover:bg-muted",
              value === e && "bg-accent ring-1 ring-primary"
            )}
          >
            {e}
          </button>
        ))}
      </div>
      <Input
        autoComplete="off"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="Ou colle ton propre emoji…"
        className="h-8 text-sm"
      />
    </div>
  );
}
