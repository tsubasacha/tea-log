import Link from "next/link";

import { TEA_TYPE_LABELS } from "@/lib/constants";
import type { TeaType } from "@/lib/supabase/types";

interface TeaLeafCardProps {
  id: string;
  name: string;
  teaType: TeaType;
  producer?: string | null;
}

export function TeaLeafCard({ id, name, teaType, producer }: TeaLeafCardProps) {
  return (
    <Link
      href={`/tea/${id}`}
      className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors active:bg-muted/60"
    >
      <p className="truncate text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground">
        {TEA_TYPE_LABELS[teaType]}
        {producer ? ` ・ ${producer}` : ""}
      </p>
    </Link>
  );
}
