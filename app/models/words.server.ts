import type { Games, Words } from "@prisma/client";
import { supabase } from "~/db.server";

export async function findNextWordForUser(user_id: string): Promise<Words> {
  let wordRow = await getFindNextWordForUser(user_id);
  if (!wordRow) {
    // User is out of words
    wordRow = await getWord();
  }

  // addDefinitionToWord(wordRow);
  // if (!doesWordRowHasDefinitions(wordRow)) {
  //   return findNextWordForUser(user_id);
  // }

  return wordRow;
}

async function getWord(): Promise<Words> {
  const { data } = supabase.from("random_words").select().limit(1).single();
  return data;
}

async function getFindNextWordForUser(user_id: string): Promise<Words | null> {
  const { data: userGames } = await supabase
    .from("Games")
    .select()
    .eq("user_id", user_id);

  const { data: nextWord } = await userGames.reduce(
    (acc: typeof supabase, { word_id }: Games) => acc.neq("id", word_id),
    supabase.from("random_word").select().limit(1).single()
  );

  return nextWord;
}

function doesWordRowHasDefinitions(wordRow: Words) {
  return Array.isArray(wordRow.definitions) && !wordRow.definitions.length;
}

async function addDefinitionToWord(wordRow: Words): Promise<Words | null> {
  // ***TODO***
  if (!doesWordRowHasDefinitions(wordRow)) {
    try {
      // const res = await fetch(
      //   // Pulled from data key instead?
      //   `https://api.dictionaryapi.dev/api/v2/entries/en/${wordRow.word}`
      // );
      // const jsonRes = await res.json();
      // console.log("DICT API: ", jsonRes);
      // const { meanings: definitions } = jsonRes;
      // if (!definitions) {
      //   await supabase.from("Words").delete().eq("id", wordRow.id);
      //   return null;
      // }
      // const { id, ...row } = wordRow;
      // const { data } = supabase
      //   .from("Words")
      //   .upsert({ id, ...row /*,definitions*/ })
      //   .select();
      // return data;
    } catch (err) {
      return wordRow;
    }
  }

  return wordRow;
}
