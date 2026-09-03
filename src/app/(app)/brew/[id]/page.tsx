import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { TasteDisplay } from "@/components/brew/taste-display";
import { SetBestButton } from "@/components/brew/set-best-button";
import { TASTE_LABELS, INFUSION_LABELS, TEA_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { getBrew } from "@/lib/data/brews";

export default async function BrewDetailPage({
  params,
}: PageProps<"/brew/[id]">) {
  const { id } = await params;
  const brew = await getBrew(id);

  if (!brew) {
    notFound();
  }

  const teaLeaf = brew.tea_leaves;

  return (
    <div className="flex flex-col">
      <PageHeader title="抽出記録" backHref="/" />

      <div className="flex flex-col gap-8 px-5 py-6">
        <section className="flex flex-col gap-1">
          {teaLeaf ? (
            <Link
              href={`/tea/${teaLeaf.id}`}
              className="text-lg font-medium underline-offset-4 hover:underline"
            >
              {teaLeaf.name}
            </Link>
          ) : (
            <p className="text-lg font-medium">不明な茶葉</p>
          )}
          <p className="text-sm text-muted-foreground">
            {teaLeaf && `${TEA_TYPE_LABELS[teaLeaf.tea_type]} ・ `}
            {formatDate(brew.brewed_at)} ・ {INFUSION_LABELS[brew.infusion_number]}
          </p>
        </section>

        <section className="grid grid-cols-4 gap-2 rounded-lg border border-border bg-card px-4 py-4 text-center">
          <Stat value={`${brew.tea_amount}`} unit="g" label="茶葉" />
          <Stat value={`${brew.water_amount}`} unit="ml" label="湯量" />
          <Stat value={`${brew.water_temperature}`} unit="℃" label="湯温" />
          <Stat value={`${brew.steeping_time}`} unit="sec" label="時間" />
        </section>

        <section className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4">
          <h2 className="pt-3.5 pb-1 text-sm text-muted-foreground">
            味の評価
          </h2>
          <div className="divide-y divide-border">
            <TasteDisplay label={TASTE_LABELS.aroma} value={brew.aroma} />
            <TasteDisplay
              label={TASTE_LABELS.sweetness}
              value={brew.sweetness}
            />
            <TasteDisplay label={TASTE_LABELS.umami} value={brew.umami} />
            <TasteDisplay
              label={TASTE_LABELS.astringency}
              value={brew.astringency}
            />
            <TasteDisplay
              label={TASTE_LABELS.bitterness}
              value={brew.bitterness}
            />
          </div>
        </section>

        {brew.memo && (
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              味・香りのメモ
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
              {brew.memo}
            </p>
          </section>
        )}

        {teaLeaf && (
          <SetBestButton
            brewId={brew.id}
            teaLeafId={teaLeaf.id}
            isBest={brew.is_best}
          />
        )}
      </div>
    </div>
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
