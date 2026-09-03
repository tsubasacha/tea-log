"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { createBrew } from "@/lib/actions/brews";
import {
  DEFAULT_BREW_VALUES,
  INFUSION_OPTIONS,
  TASTE_LABELS,
} from "@/lib/constants";
import type { InfusionNumber, TeaType } from "@/lib/supabase/types";
import { TEA_TYPE_LABELS } from "@/lib/constants";
import { Stepper } from "@/components/ui/stepper";
import { TasteRating } from "@/components/ui/taste-rating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TeaLeafOption {
  id: string;
  name: string;
  tea_type: TeaType;
}

interface BrewFormProps {
  teaLeaves: TeaLeafOption[];
  defaultTeaLeafId?: string;
}

type Taste = "aroma" | "sweetness" | "umami" | "astringency" | "bitterness";

export function BrewForm({ teaLeaves, defaultTeaLeafId }: BrewFormProps) {
  const [state, formAction, pending] = useActionState(createBrew, {});

  const [teaLeafId, setTeaLeafId] = useState(defaultTeaLeafId ?? "");
  const [teaAmount, setTeaAmount] = useState<number>(
    DEFAULT_BREW_VALUES.teaAmount,
  );
  const [waterAmount, setWaterAmount] = useState<number>(
    DEFAULT_BREW_VALUES.waterAmount,
  );
  const [waterTemperature, setWaterTemperature] = useState<number>(
    DEFAULT_BREW_VALUES.waterTemperature,
  );
  const [steepingTime, setSteepingTime] = useState<number>(40);
  const [infusionNumber, setInfusionNumber] = useState<InfusionNumber>("1");
  const [taste, setTaste] = useState<Record<Taste, number>>({
    aroma: 3,
    sweetness: 3,
    umami: 3,
    astringency: 3,
    bitterness: 3,
  });

  const today = new Date().toISOString().slice(0, 10);

  if (teaLeaves.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-5 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          記録するにはまず茶葉を登録してください。
        </p>
        <Button asChild>
          <Link href="/tea/new">茶葉を登録する</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-7 px-5 py-6">
      <input type="hidden" name="tea_leaf_id" value={teaLeafId} />
      <input type="hidden" name="water_temperature" value={waterTemperature} />
      <input type="hidden" name="tea_amount" value={teaAmount} />
      <input type="hidden" name="water_amount" value={waterAmount} />
      <input type="hidden" name="steeping_time" value={steepingTime} />
      <input type="hidden" name="infusion_number" value={infusionNumber} />
      <input type="hidden" name="aroma" value={taste.aroma} />
      <input type="hidden" name="sweetness" value={taste.sweetness} />
      <input type="hidden" name="umami" value={taste.umami} />
      <input type="hidden" name="astringency" value={taste.astringency} />
      <input type="hidden" name="bitterness" value={taste.bitterness} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tea_leaf_select">茶葉</Label>
        <Select value={teaLeafId} onValueChange={setTeaLeafId}>
          <SelectTrigger id="tea_leaf_select">
            <SelectValue placeholder="茶葉を選択" />
          </SelectTrigger>
          <SelectContent>
            {teaLeaves.map((leaf) => (
              <SelectItem key={leaf.id} value={leaf.id}>
                {leaf.name}
                <span className="ml-1.5 text-muted-foreground">
                  ({TEA_TYPE_LABELS[leaf.tea_type]})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="brewed_at">日付</Label>
        <Input
          id="brewed_at"
          name="brewed_at"
          type="date"
          defaultValue={today}
          max={today}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tea_amount_input">茶葉量</Label>
        <Stepper
          inputId="tea_amount_input"
          value={teaAmount}
          onChange={setTeaAmount}
          step={0.5}
          min={0.5}
          max={30}
          decimals={1}
          unit="g"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="water_amount_input">湯量</Label>
        <Stepper
          inputId="water_amount_input"
          value={waterAmount}
          onChange={setWaterAmount}
          step={10}
          min={10}
          max={1000}
          unit="ml"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="water_temperature_input">湯温</Label>
        <Stepper
          inputId="water_temperature_input"
          value={waterTemperature}
          onChange={setWaterTemperature}
          step={5}
          min={5}
          max={100}
          unit="℃"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="steeping_time_input">抽出時間</Label>
        <div className="flex items-center gap-2">
          <Input
            id="steeping_time_input"
            type="number"
            inputMode="numeric"
            value={steepingTime}
            onChange={(e) => setSteepingTime(Number(e.target.value))}
            className="max-w-28 text-center text-base"
            min={1}
          />
          <span className="text-sm text-muted-foreground">sec</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>煎数</Label>
        <div className="grid grid-cols-4 gap-2">
          {INFUSION_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setInfusionNumber(option.value)}
              className={cn(
                "rounded-md border px-2 py-2.5 text-xs font-medium transition-colors",
                infusionNumber === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-lg border border-border bg-card px-4">
        <Label className="pt-3.5 pb-1 text-sm text-muted-foreground">
          味の評価
        </Label>
        <div className="divide-y divide-border">
          {(Object.keys(TASTE_LABELS) as Taste[]).map((key) => (
            <TasteRating
              key={key}
              label={TASTE_LABELS[key]}
              value={taste[key]}
              onChange={(value) =>
                setTaste((prev) => ({ ...prev, [key]: value }))
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="memo">味・香りのメモ</Label>
        <Textarea
          id="memo"
          name="memo"
          rows={4}
          placeholder="例）80℃より焙煎香が立った。味の輪郭もしっかりしている。"
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={pending || !teaLeafId}
        className="mt-2"
      >
        {pending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
