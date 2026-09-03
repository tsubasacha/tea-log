import type { InfusionNumber, TeaType } from "@/lib/supabase/types";

export const TEA_TYPE_LABELS: Record<TeaType, string> = {
  sencha: "煎茶",
  fukamushi: "深蒸し煎茶",
  gyokuro: "玉露",
  kabusecha: "かぶせ茶",
  bancha: "番茶",
  hojicha: "ほうじ茶",
  genmaicha: "玄米茶",
  wakoucha: "和紅茶",
  other: "その他",
};

export const TEA_TYPE_OPTIONS: { value: TeaType; label: string }[] = (
  Object.keys(TEA_TYPE_LABELS) as TeaType[]
).map((value) => ({ value, label: TEA_TYPE_LABELS[value] }));

export const INFUSION_LABELS: Record<InfusionNumber, string> = {
  "1": "1煎目",
  "2": "2煎目",
  "3": "3煎目",
  other: "その他",
};

export const INFUSION_OPTIONS: { value: InfusionNumber; label: string }[] = (
  Object.keys(INFUSION_LABELS) as InfusionNumber[]
).map((value) => ({ value, label: INFUSION_LABELS[value] }));

export const TASTE_LABELS = {
  aroma: "香り",
  sweetness: "甘み",
  umami: "旨み",
  astringency: "渋み",
  bitterness: "苦み",
} as const;

export const DEFAULT_BREW_VALUES = {
  teaAmount: 3,
  waterAmount: 150,
  waterTemperature: 80,
  steepingTime: 40,
} as const;
