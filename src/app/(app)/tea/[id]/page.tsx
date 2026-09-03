import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { BestBrewCard } from "@/components/tea/best-brew-card";
import { BrewListItem } from "@/components/brew/brew-list-item";
import { Button } from "@/components/ui/button";
import { TEA_TYPE_LABELS } from "@/lib/constants";
import { getTeaLeaf } from "@/lib/data/tea-leaves";
import { getBestBrewForTeaLeaf, getBrewsForTeaLeaf } from "@/lib/data/brews";

export default async function TeaDetailPage({
  params,
}: PageProps<"/tea/[id]">) {
  const { id } = await params;
  const teaLeaf = await getTeaLeaf(id);

  if (!teaLeaf) {
    notFound();
  }

  const [bestBrew, brews] = await Promise.all([
    getBestBrewForTeaLeaf(id),
    getBrewsForTeaLeaf(id),
  ]);

  return (
    <div className="flex flex-col">
      <PageHeader title={teaLeaf.name} backHref="/tea" />

      <div className="flex flex-col gap-8 px-5 py-6">
        <section className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{TEA_TYPE_LABELS[teaLeaf.tea_type]}</span>
            {teaLeaf.producer && <span>・ {teaLeaf.producer}</span>}
            {teaLeaf.origin && <span>・ {teaLeaf.origin}</span>}
          </div>
          {teaLeaf.memo && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
              {teaLeaf.memo}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="text-sm font-medium text-muted-foreground">
            MY BEST
          </h2>
          <BestBrewCard brew={bestBrew} />
        </section>

        <Button asChild size="lg" variant="outline">
          <Link href={`/brew/new?tea=${teaLeaf.id}`}>この茶葉で記録する</Link>
        </Button>

        <section className="flex flex-col gap-2.5 pb-8">
          <h2 className="text-sm font-medium text-muted-foreground">
            この茶葉の抽出履歴
          </h2>
          {brews.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
              まだ抽出記録がありません。
            </p>
          ) : (
            <div className="flex flex-col">
              {brews.map((brew) => (
                <BrewListItem
                  key={brew.id}
                  id={brew.id}
                  teaLeafName={teaLeaf.name}
                  brewedAt={brew.brewed_at}
                  teaAmount={brew.tea_amount}
                  waterTemperature={brew.water_temperature}
                  steepingTime={brew.steeping_time}
                  infusionNumber={brew.infusion_number}
                  isBest={brew.is_best}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
