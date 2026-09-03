import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrewListItem } from "@/components/brew/brew-list-item";
import { TeaLeafCard } from "@/components/tea/tea-leaf-card";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getRecentBrews } from "@/lib/data/brews";
import { getRecentTeaLeaves } from "@/lib/data/tea-leaves";

export default async function HomePage() {
  const [brews, recentLeaves] = await Promise.all([
    getRecentBrews(5),
    getRecentTeaLeaves(6),
  ]);

  return (
    <div className="flex flex-col gap-10 px-5 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground">
            TEA LOG
          </p>
          <h1 className="mt-1 text-2xl font-medium">お茶の記録帳</h1>
        </div>
        <SignOutButton />
      </div>

      <Button asChild size="lg" className="h-14 text-base">
        <Link href="/brew/new">今日のお茶を記録する</Link>
      </Button>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            最近の抽出記録
          </h2>
          {brews.length > 0 && (
            <Link
              href="/brew"
              className="flex items-center gap-0.5 text-xs text-muted-foreground"
            >
              すべて見る
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {brews.length === 0 ? (
          <EmptyState message="まだ記録がありません。最初の一杯を記録してみましょう。" />
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
      </section>

      <section className="flex flex-col gap-3 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">
            最近飲んだ茶葉
          </h2>
          {recentLeaves.length > 0 && (
            <Link
              href="/tea"
              className="flex items-center gap-0.5 text-xs text-muted-foreground"
            >
              すべて見る
              <ArrowRight className="size-3" />
            </Link>
          )}
        </div>

        {recentLeaves.length === 0 ? (
          <EmptyState message="茶葉を登録すると、ここに表示されます。" />
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {recentLeaves.map((leaf) => (
              <TeaLeafCard
                key={leaf.id}
                id={leaf.id}
                name={leaf.name}
                teaType={leaf.tea_type}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-xs text-muted-foreground">
      {message}
    </p>
  );
}
