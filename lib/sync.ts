import { createClient } from "@/lib/supabase/client";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

async function getUserId(): Promise<string | null> {
  if (!supabaseConfigured) return null;
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function syncPullAll<T>(table: string): Promise<T[] | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);
  if (error) {
    console.error(`[sync] pull ${table} failed`, error.message);
    return null;
  }
  return data as T[];
}

export async function syncInsert(table: string, entity: object) {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase.from(table).insert({ ...entity, user_id: userId });
  if (error) console.error(`[sync] insert ${table} failed`, error.message);
}

export async function syncUpdate(table: string, id: string, patch: object) {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase.from(table).update(patch).eq("id", id).eq("user_id", userId);
  if (error) console.error(`[sync] update ${table} failed`, error.message);
}

export async function syncRemove(table: string, id: string) {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq("id", id).eq("user_id", userId);
  if (error) console.error(`[sync] delete ${table} failed`, error.message);
}

export async function syncUpsertSingleton(table: string, row: object) {
  const userId = await getUserId();
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase.from(table).upsert({ ...row, user_id: userId }, { onConflict: "user_id" });
  if (error) console.error(`[sync] upsert ${table} failed`, error.message);
}

export async function syncPullSingleton<T>(table: string): Promise<T | null> {
  const userId = await getUserId();
  if (!userId) return null;
  const supabase = createClient();
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId).maybeSingle();
  if (error) {
    console.error(`[sync] pull ${table} failed`, error.message);
    return null;
  }
  return data as T | null;
}
