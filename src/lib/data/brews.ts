import { createClient } from "@/lib/supabase/server";

export async function getRecentBrews(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brews")
    .select("*, tea_leaves(id, name, tea_type)")
    .order("brewed_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getBrewsForTeaLeaf(teaLeafId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brews")
    .select("*")
    .eq("tea_leaf_id", teaLeafId)
    .order("brewed_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBrew(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brews")
    .select("*, tea_leaves(id, name, tea_type, producer)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBestBrewForTeaLeaf(teaLeafId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brews")
    .select("*")
    .eq("tea_leaf_id", teaLeafId)
    .eq("is_best", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
