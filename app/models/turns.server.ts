import type { Turns } from "@prisma/client";
import { supabase } from "~/db.server";

export async function getTurnsForGame(game_id: string): Promise<Array<Turns>> {
  const { data } = supabase
    .from("Turns")
    .select("*")
    .eq("game_id", game_id)
    .order("createdAt", { ascending: true });

  return data;
}
