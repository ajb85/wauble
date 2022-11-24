import type { Turns } from "@prisma/client";
import supabaseToken from "./cookie";
import { supabase } from "./db.server";
import type { RequestMeta } from "./types";
import { mergeObjects } from "./utils";

export const getToken = async ({ request }: RequestMeta) => {
  const cookieHeader = request.headers.get("Cookie");
  return await supabaseToken.parse(cookieHeader);
};

export const getUserByToken = async (token: string) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  return { user, error };
};

export const authenticateRequest = async (meta: RequestMeta) => {
  const token = await getToken(meta);
  if (token) {
    const { user, error } = await getUserByToken(token);

    if (error) {
      return false;
    }

    if (user) {
      const profile = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", user.id)
        .limit(1)
        .single();

      if (profile?.data) {
        return {
          id: user.id,
          email: user.email,
          ...profile.data,
        };
      }
    }

    return false;
  }
};

export const returnFromLoader = (
  meta: RequestMeta,
  data: { [k: string]: any }
) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  if (!meta.locals.loader) {
    meta.locals.loader = {};
  }

  meta.locals.loader = mergeObjects(meta.locals.loader, data);
};

export const saveToRequest = (
  meta: RequestMeta,
  data: { [k: string]: any }
) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  meta.locals = mergeObjects(meta.locals, data);
};

export const getFromLoader = (meta: RequestMeta, key?: string) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  if (!meta.locals.loader) {
    meta.locals.loader = {};
  }

  return key ? meta.locals.loader[key] : meta.locals.loader;
};

export type PTurn = Array<{
  letter: string;
  isInWord: boolean;
}>;

export type CorrectPositions = Array<string | null>;

export type ProcessedTurns = {
  turns: Array<PTurn>;
  correctPositions: CorrectPositions;
  guesses: { [k: string]: "correct" | "inWord" | "wrong" };
};
export function processTurns(turns: Array<Turns>, w: string) {
  const word = w.toLowerCase();
  const isLetterInWord = turns.map(() => getIsLetterInWord(word));
  console.log("WORD IS", word);
  const correctPositions: CorrectPositions = new Array(word.length)
    .fill(null)
    .map((position, i) => {
      return (
        turns.find((t, j) => {
          // Loop first to remove correct letters from the count so the first instance of the
          // letter isn't considered the correct one
          const guess = t.word.toLowerCase();
          const isMatch = guess[i] === word[i];
          if (isMatch) isLetterInWord[j](guess[i]); // Reduce counter
          return isMatch;
        })?.word[i] || position
      );
    });

  return turns.reduce(
    (acc: ProcessedTurns, turn, turnIndex) => {
      acc.turns.push(
        turn.word
          .toLowerCase()
          .split("")
          .map((letter, letterIndex) => {
            const isCorrect =
              acc.correctPositions[letterIndex]?.toLowerCase() ===
              letter.toLowerCase();
            const isInWord = isCorrect || isLetterInWord[turnIndex](letter);
            if (!acc.guesses[letter]) {
              acc.guesses[letter] = isCorrect
                ? "correct"
                : isInWord
                ? "inWord"
                : "wrong";
            }
            return {
              letter,
              isInWord,
            };
          })
      );

      return acc;
    },
    {
      correctPositions,
      turns: [],
      guesses: {},
    }
  );
}
function getIsLetterInWord(word: string) {
  const lookup = word
    .toLowerCase()
    .split("")
    .reduce((acc: { [k: string]: number }, cur) => {
      if (acc[cur]) {
        acc[cur]++;
      } else {
        acc[cur] = 1;
      }

      return acc;
    }, {});

  return (letter: string) => {
    if (!lookup[letter]) {
      return false;
    }

    lookup[letter]--;
    return true;
  };
}
