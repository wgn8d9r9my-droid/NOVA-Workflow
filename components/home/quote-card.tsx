import { Quote } from "lucide-react";

const QUOTES = [
  { text: "La discipline d'aujourd'hui est la liberté de demain.", author: "Nova" },
  { text: "Ce n'est pas le temps qui te manque, c'est la concentration.", author: "Nova" },
  { text: "Fais une chose. Fais-la bien. Puis la suivante.", author: "Nova" },
  { text: "Les petits pas répétés déplacent des montagnes.", author: "Nova" },
  { text: "Crée d'abord, juge ensuite.", author: "Nova" },
  { text: "Ton futur se construit dans les détails d'aujourd'hui.", author: "Nova" },
  { text: "La clarté vient de l'action, pas de la réflexion sans fin.", author: "Nova" },
];

function dayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function QuoteCard() {
  const quote = QUOTES[dayOfYear(new Date()) % QUOTES.length];

  return (
    <div className="grain relative flex min-h-[132px] flex-1 flex-col justify-between overflow-hidden rounded-3xl p-5 text-white cover-mesh-2">
      <Quote className="relative z-10 size-6 text-white/50" />
      <div className="relative z-10">
        <p className="text-[15px] font-medium leading-snug">{quote.text}</p>
        <p className="mt-1.5 text-xs text-white/50">— {quote.author}</p>
      </div>
    </div>
  );
}
