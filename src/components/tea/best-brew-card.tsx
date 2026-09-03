import Link from "next/link";
import { Star } from "lucide-react";

import { INFUSION_LABELS } from "@/lib/constants";
import type { Database } from "@/lib/supabase/types";

type Brew = Database["public"]["Tables"]["brews"]["Row"];

export function BestBrewCard({ brew }: { brew: Brew | null }) {
  if (!brew) {
    return (
      <div className="rounded-lg border border-dashed border-border px-4 py-5 text-center text-xs text-muted-foreground">
        MY BEST はまだ設定されていません。
        <br />
        記録の詳細画面から設定できます。
      </div>
    );
  }

  return (
    <Link
      href={`/brew/${brew.id}`}
      className="flex flex-col gap-3 rounded-lg border border-primary/30 bg-accent px-4 py-4 transition-colors active:bg-accent/70"
    >
      <div className="flex items-center gap-1.5 text-primary">
        <Star className="size-3.5 fill-primary" />
        <span className="text-xs font-medium tracking-wide">MY BEST</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat value={`${brew.tea_amount}`} unit="g" label="茶葉" />
        <Stat value={`${brew.water_amount}`} unit="ml" label="湯量" />
        <Stat value={`${brew.water_temperature}`} unit="℃" label="湯温" />
        <Stat value={`${brew.steeping_time}`} unit="sec" label="時間" />
      </div>
      <p className="text-center text-[11px] text-muted-foreground">
        {INFUSION_LABELS[brew.infusion_number]}
      </p>
    </Link>
  );
}

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-lg leading-tight font-medium tabular-nums text-foreground">
        {value}
        <span className="ml-0.5 text-xs font-normal text-muted-foreground">
          {unit}
        </span>
      </span>
      <span className="mt-0.5 text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
