import { createClient } from "@/lib/supabase/server";
import type { TeaType } from "@/lib/supabase/types";

export async function getTeaLeaves() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tea_leaves")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTeaLeaf(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tea_leaves")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRecentTeaLeaves(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brews")
    .select("tea_leaf_id, brewed_at, tea_leaves(id, name, tea_type)")
    .order("brewed_at", { ascending: false })
    .limit(30);

  if (error) throw error;

  const seen = new Set<string>();
  const result: { id: string; name: string; tea_type: TeaType }[] = [];

  for (const row of data ?? []) {
    const leaf = row.tea_leaves as unknown as {
      id: string;
      name: string;
      tea_type: TeaType;
    } | null;
    if (!leaf || seen.has(leaf.id)) continue;
    seen.add(leaf.id);
    result.push(leaf);
    if (result.length >= limit) break;
  }

  return result;
}
