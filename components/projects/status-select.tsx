"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectStatusMeta, projectStatusOrder } from "@/lib/project-status";
import type { ProjectStatus } from "@/types/entities";
import { cn } from "@/lib/utils";

export function StatusSelect({
  value,
  onChange,
  className,
}: {
  value: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ProjectStatus)}>
      <SelectTrigger
        size="sm"
        className={cn("h-7 border-none px-2 text-[11px] font-medium shadow-none", projectStatusMeta[value].className, className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {projectStatusOrder.map((s) => (
          <SelectItem key={s} value={s}>
            {projectStatusMeta[s].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
