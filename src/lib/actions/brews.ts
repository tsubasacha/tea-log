"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { InfusionNumber } from "@/lib/supabase/types";

export interface BrewFormState {
  error?: string;
}

function parseNumber(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export async function createBrew(
  _prevState: BrewFormState,
  formData: FormData,
): Promise<BrewFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teaLeafId = String(formData.get("tea_leaf_id") ?? "");
  const brewedAt = String(formData.get("brewed_at") ?? "");
  const teaAmount = parseNumber(formData, "tea_amount");
  const waterAmount = parseNumber(formData, "water_amount");
  const waterTemperature = parseNumber(formData, "water_temperature");
  const steepingTime = parseNumber(formData, "steeping_time");
  const infusionNumber = String(
    formData.get("infusion_number") ?? "1",
  ) as InfusionNumber;
  const aroma = parseNumber(formData, "aroma");
  const sweetness = parseNumber(formData, "sweetness");
  const umami = parseNumber(formData, "umami");
  const astringency = parseNumber(formData, "astringency");
  const bitterness = parseNumber(formData, "bitterness");
  const memo = String(formData.get("memo") ?? "").trim();

  if (!teaLeafId) {
    return { error: "茶葉を選択してください。" };
  }
  if (!teaAmount || !waterAmount || !waterTemperature || !steepingTime) {
    return { error: "抽出条件をすべて入力してください。" };
  }
  if (!aroma || !sweetness || !umami || !astringency || !bitterness) {
    return { error: "味の評価をすべて入力してください。" };
  }

  const { data, error } = await supabase
    .from("brews")
    .insert({
      user_id: user.id,
      tea_leaf_id: teaLeafId,
      brewed_at: brewedAt || new Date().toISOString().slice(0, 10),
      tea_amount: teaAmount,
      water_amount: waterAmount,
      water_temperature: waterTemperature,
      steeping_time: steepingTime,
      infusion_number: infusionNumber,
      aroma,
      sweetness,
      umami,
      astringency,
      bitterness,
      memo: memo || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "記録の保存に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/");
  revalidatePath("/tea");
  revalidatePath(`/tea/${teaLeafId}`);
  redirect(`/brew/${data.id}`);
}

export async function setBestBrew(brewId: string, teaLeafId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("set_best_brew", { brew_id: brewId });

  if (error) {
    throw new Error("MY BESTの設定に失敗しました。");
  }

  revalidatePath(`/brew/${brewId}`);
  revalidatePath(`/tea/${teaLeafId}`);
  revalidatePath("/");
}
