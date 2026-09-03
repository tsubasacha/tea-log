import Link from "next/link";
import { Star } from "lucide-react";

import { INFUSION_LABELS } from "@/lib/constants";
import type { InfusionNumber } from "@/lib/supabase/types";
import { formatDate } from "@/lib/format";

interface BrewListItemProps {
  id: string;
  teaLeafName: string;
  brewedAt: string;
  teaAmount: number;
  waterTemperature: number;
  steepingTime: number;
  infusionNumber: InfusionNumber;
  isBest: boolean;
}

export function BrewListItem({
  id,
  teaLeafName,
  brewedAt,
  teaAmount,
  waterTemperature,
  steepingTime,
  infusionNumber,
  isBest,
}: BrewListItemProps) {
  return (
    <Link
      href={`/brew/${id}`}
      className="flex items-center justify-between gap-3 border-b border-border py-4 transition-colors active:bg-muted/60"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {isBest && (
            <Star
              className="size-3.5 shrink-0 fill-primary text-primary"
              aria-label="MY BEST"
            />
          )}
          <p className="truncate text-sm font-medium">{teaLeafName}</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatDate(brewedAt)} ・ {INFUSION_LABELS[infusionNumber]}
        </p>
      </div>
      <div className="shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        <p>
          {teaAmount}g / {waterTemperature}℃
        </p>
        <p>{steepingTime}sec</p>
      </div>
    </Link>
  );
}
