"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SpotlightContent } from "@/lib/home-intelligence";

export function SpotlightCard({ content }: { content: SpotlightContent }) {
  return (
    <div className="glass shadow-glow relative overflow-hidden rounded-4xl p-6 sm:p-8">
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-glow/20 blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <content.icon className="size-5" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight">{content.title}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{content.description}</p>
        </div>
        <Link
          href={content.href}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary transition-transform hover:gap-2.5"
        >
          {content.cta} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
