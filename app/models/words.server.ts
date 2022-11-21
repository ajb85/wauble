import type { Words } from "@prisma/client";
import { supabase } from "~/db.server";

export async function findNextWordForUser(user_id: string): Promise<Words> {
  let wordRow = await getFindNextWordForUser(user_id);
  if (!wordRow) {
    // User is out of words
    wordRow = await getWord();
  }

  addDefinitionToWord(wordRow);
  if (!doesWordRowHasDefinitions(wordRow)) {
    return findNextWordForUser(user_id);
  }

  return wordRow;
}

function getWord(): Words {
  return supabase.from("random_words").select().limit(1).single();
}

function getFindNextWordForUser(user_id: string): Words | null {
  return supabase
    .from("random_words")
    .select(`*, Games (user_id, word_id), Profiles(id)`)
    .eq("Profiles.user_id", user_id)
    .filter("Games.word_id", "is", null)
    .limit(1)
    .single();
}

function doesWordRowHasDefinitions(wordRow: Words) {
  return Array.isArray(wordRow.definitions) && !wordRow.definitions.length;
}

async function addDefinitionToWord(wordRow: Words): Promise<Words | null> {
  // ***TODO***
  if (!doesWordRowHasDefinitions(wordRow)) {
    try {
      const res = await fetch(
        // Pulled from data key instead?
        `https://api.dictionaryapi.dev/api/v2/entries/en/${wordRow.word}`
      );
      const jsonRes = await res.json();
      console.log("DICT API: ", jsonRes);
      const { meanings: definitions } = jsonRes;

      if (!definitions) {
        await supabase.from("Words").delete().eq("id", wordRow.id);
        return null;
      }
      const { id, ...row } = wordRow;
      return supabase
        .from("Words")
        .upsert({ id, ...row, definitions })
        .select();
    } catch (err) {
      return wordRow;
    }
  }

  return wordRow;
}
