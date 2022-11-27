import { supabase } from "~/db.server";
import { getGameStatus, processTurns } from "~/utils.server";
import { getTurnsForGame } from "./turns.server";
import { findNextWordForUser } from "./words.server";
import type { ProcessedTurns } from "~/utils.server";
import { Games } from "@prisma/client";

export type ProcessedGame = {
  processedTurns: ProcessedTurns;
  hasWon: boolean;
  isOver: boolean;
  word?: string;
};

interface GameWithWord extends Games {
  Words: { word: string; id: string };
}
export async function getGameForUser(user_id: string): Promise<GameWithWord> {
  const { data: existingGame } = await supabase
    .from("Games")
    .select("*, Words ( id, word )")
    .eq("user_id", user_id)
    .eq("score", 0)
    .limit(1)
    .single();

  return existingGame;
}

export async function getProcessedGameForUser(
  user_id: string
): Promise<ProcessedGame> {
  const existingGame = await getGameForUser(user_id);

  const turns = existingGame ? await getTurnsForGame(existingGame.id) : [];
  const word = existingGame
    ? existingGame.Words
    : await findNextWordForUser(user_id);
  const processedTurns = processTurns(turns ?? [], word.word);

  if (!existingGame)
    await supabase
      .from("Games")
      .insert({ user_id, score: 0, word_id: word.id });
  const { hasWon, isOver } = getGameStatus(processedTurns);

  return {
    processedTurns,
    hasWon,
    isOver,
    word: isOver ? word.word : undefined,
  };
}

export async function updateGame(game: Games) {
  return await supabase.from("Games").update(game).eq("id", game.id);
}
