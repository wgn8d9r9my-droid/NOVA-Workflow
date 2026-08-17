import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function NovaCard() {
  return (
    <div className="glass shadow-soft flex flex-col items-center justify-center gap-3 rounded-3xl p-5 text-center">
      <div className="relative flex size-14 items-center justify-center">
        <span className="orb-glow absolute inset-0 rounded-full bg-gradient-to-br from-primary to-glow blur-[2px]" />
        <Sparkles className="relative z-10 size-6 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium">Nova AI</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Comment puis-je t&apos;aider aujourd&apos;hui ?</p>
      </div>
      <Link
        href="/nova"
        className="mt-1 flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        Demande à Nova
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
