import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getRoutes() {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRouteById(routeId: string) {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("id", routeId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getRoutePoints(routeId: string) {
  const { data, error } = await supabase
    .from("route_points")
    .select("*")
    .eq("route_id", routeId)
    .order("ts", { ascending: true });

  if (error) throw error;
  return data;
}

// Operator action: confirm the load was recycled. Flips status to 'recycled'
// and records the proof (timestamp + note) rather than just changing the enum.
export async function confirmRouteRecycled(routeId: string, note: string) {
  const { data, error } = await supabase
    .from("routes")
    .update({
      status: "recycled",
      confirmed_at: new Date().toISOString(),
      confirmation_note: note,
    })
    .eq("id", routeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCollectionPoints() {
  const { data, error } = await supabase.from("collection_points").select("*");

  if (error) throw error;
  return data;
}

export async function getWasteItems() {
  const { data, error } = await supabase
    .from("waste_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createWasteItem(
  item: Database["public"]["Tables"]["waste_items"]["Insert"],
) {
  const { data, error } = await supabase
    .from("waste_items")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}
