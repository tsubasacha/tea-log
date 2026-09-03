"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";

import { setBestBrew } from "@/lib/actions/brews";
import { Button } from "@/components/ui/button";

export function SetBestButton({
  brewId,
  teaLeafId,
  isBest,
}: {
  brewId: string;
  teaLeafId: string;
  isBest: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (isBest) {
    return (
      <Button size="lg" variant="secondary" disabled className="gap-2">
        <Star className="size-4 fill-primary text-primary" />
        MY BEST に設定済み
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      variant="outline"
      disabled={isPending}
      className="gap-2"
      onClick={() =>
        startTransition(() => {
          setBestBrew(brewId, teaLeafId);
        })
      }
    >
      <Star className="size-4" />
      {isPending ? "設定中..." : "MY BEST に設定する"}
    </Button>
  );
}
