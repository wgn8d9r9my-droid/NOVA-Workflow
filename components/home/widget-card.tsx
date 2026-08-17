import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function WidgetCard({
  title,
  badge,
  href,
  hrefLabel = "Voir tout",
  empty,
  emptyLabel = "Rien à afficher pour l'instant.",
  children,
  className,
}: {
  title: string;
  badge?: string | number;
  href?: string;
  hrefLabel?: string;
  empty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass shadow-soft flex flex-col rounded-3xl p-4", className)}>
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-medium text-foreground/80">{title}</h3>
          {badge != null && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-medium text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
        {href && (
          <Link href={href} className="text-xs text-muted-foreground hover:text-primary">
            {hrefLabel}
          </Link>
        )}
      </div>
      {empty ? (
        <p className="px-0.5 py-4 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="flex flex-1 flex-col">{children}</div>
      )}
    </div>
  );
}
