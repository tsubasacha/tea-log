import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { TeaLeafCard } from "@/components/tea/tea-leaf-card";
import { getTeaLeaves } from "@/lib/data/tea-leaves";

export default async function TeaLeavesPage() {
  const teaLeaves = await getTeaLeaves();

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Tea"
        action={
          <Link
            href="/tea/new"
            aria-label="茶葉を登録する"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors active:bg-muted"
          >
            <Plus className="size-5" />
          </Link>
        }
      />

      <div className="px-5 py-5">
        {teaLeaves.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-14 text-center">
            <p className="text-sm text-muted-foreground">
              まだ茶葉が登録されていません。
            </p>
            <Link
              href="/tea/new"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              最初の茶葉を登録する
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {teaLeaves.map((leaf) => (
              <TeaLeafCard
                key={leaf.id}
                id={leaf.id}
                name={leaf.name}
                teaType={leaf.tea_type}
                producer={leaf.producer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
