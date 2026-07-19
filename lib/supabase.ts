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

export async function getRoutePoints(routeId: string) {
  const { data, error } = await supabase
    .from("route_points")
    .select("*")
    .eq("route_id", routeId)
    .order("ts", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCollectionPoints() {
  const { data, error } = await supabase.from("collection_points").select("*");

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
