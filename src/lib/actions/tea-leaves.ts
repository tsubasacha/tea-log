"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { TeaType } from "@/lib/supabase/types";

export interface TeaLeafFormState {
  error?: string;
}

export async function createTeaLeaf(
  _prevState: TeaLeafFormState,
  formData: FormData,
): Promise<TeaLeafFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const teaType = String(formData.get("tea_type") ?? "") as TeaType;
  const producer = String(formData.get("producer") ?? "").trim();
  const origin = String(formData.get("origin") ?? "").trim();
  const memo = String(formData.get("memo") ?? "").trim();

  if (!name) {
    return { error: "茶葉名を入力してください。" };
  }
  if (!teaType) {
    return { error: "茶種を選択してください。" };
  }

  const { data, error } = await supabase
    .from("tea_leaves")
    .insert({
      user_id: user.id,
      name,
      tea_type: teaType,
      producer: producer || null,
      origin: origin || null,
      memo: memo || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "茶葉の登録に失敗しました。もう一度お試しください。" };
  }

  revalidatePath("/tea");
  revalidatePath("/");
  redirect(`/tea/${data.id}`);
}
