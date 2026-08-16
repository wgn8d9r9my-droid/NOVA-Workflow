import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function SectionCard({
  title,
  href,
  hrefLabel = "Voir tout",
  empty,
  children,
}: {
  title: string;
  href: string;
  hrefLabel?: string;
  empty?: boolean;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
        <Link href={href} className="text-xs text-muted-foreground hover:text-primary">
          {hrefLabel}
        </Link>
      </div>
      {empty ? (
        <p className="px-1 py-4 text-sm text-muted-foreground">Rien à afficher pour l&apos;instant.</p>
      ) : (
        children
      )}
    </Card>
  );
}
