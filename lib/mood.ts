import type { Mood } from "@/types/entities";

export const moods: { value: Mood; emoji: string; label: string }[] = [
  { value: "great", emoji: "🤩", label: "Super" },
  { value: "good", emoji: "🙂", label: "Bien" },
  { value: "neutral", emoji: "😐", label: "Neutre" },
  { value: "low", emoji: "😕", label: "Bof" },
  { value: "bad", emoji: "😞", label: "Difficile" },
];

export function moodEmoji(mood?: Mood) {
  return moods.find((m) => m.value === mood)?.emoji;
}
