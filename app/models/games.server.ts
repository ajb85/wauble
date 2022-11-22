import { supabase } from "~/db.server";
import { ProcessedTurns, processTurns } from "~/utils.server";
import { getTurnsForGame } from "./turns.server";
import { findNextWordForUser } from "./words.server";

export async function getUserGame(user_id: string): Promise<ProcessedTurns> {
  const { data: existingGame } = await supabase
    .from("Games")
    .select("*, Words ( word )")
    .eq("user_id", user_id)
    .eq("score", 0)
    .limit(1)
    .single();

  if (existingGame) {
    const turns = await getTurnsForGame(existingGame.id);
    return processTurns(turns ?? [], existingGame.Words.word);
  }

  const word = await findNextWordForUser(user_id);
  await supabase.from("Games").insert({ user_id, score: 0, word_id: word.id });
  return processTurns([], word.word);
}
