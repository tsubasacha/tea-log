import { PageHeader } from "@/components/page-header";
import { BrewListItem } from "@/components/brew/brew-list-item";
import { createClient } from "@/lib/supabase/server";

export default async function BrewHistoryPage() {
  const supabase = await createClient();
  const { data: brews, error } = await supabase
    .from("brews")
    .select("*, tea_leaves(id, name, tea_type)")
    .order("brewed_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (
    <div className="flex flex-col">
      <PageHeader title="抽出履歴" backHref="/" />

      <div className="px-5 py-4">
        {!brews || brews.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
            まだ記録がありません。
          </p>
        ) : (
          <div className="flex flex-col">
            {brews.map((brew) => (
              <BrewListItem
                key={brew.id}
                id={brew.id}
                teaLeafName={brew.tea_leaves?.name ?? "不明な茶葉"}
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
      </div>
    </div>
  );
}
