import type { Turns } from "@prisma/client";
import { supabase } from "~/db.server";

export async function getTurnsForGame(game_id: string): Promise<Array<Turns>> {
  const { data } = await supabase
    .from("Turns")
    .select("*")
    .eq("game_id", game_id)
    .order("createdAt", { ascending: true });

  return data ?? [];
}

export async function saveTurn(word: string, user_id: string) {
  const { data: currentGame } = await supabase
    .from("Games")
    .select("id")
    .eq("score", 0)
    .eq("user_id", user_id)
    .limit(1)
    .single();

  if (currentGame !== null) {
    await supabase
      .from("Turns")
      .insert({ word, user_id, game_id: currentGame.id });
  } else {
    console.error(`No game found for ${word}`);
  }
}
