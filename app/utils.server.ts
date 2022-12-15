import type { Turns } from "@prisma/client";
import supabaseToken from "./cookie";
import { supabase } from "./db.server";
import type { RequestMeta, StringObject } from "./types";
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

export const getFromRequest = (meta: RequestMeta, key?: string) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  return key ? meta.locals[key] : meta.locals;
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

export type SinglePTurn = {
  letter: string;
  isInWord: boolean;
};
export type PTurn = Array<SinglePTurn>;

export type GameTurn = {
  letter: string;
  isCorrect?: boolean;
};

export type CorrectPositions = Array<string | null>;
export type GuessesLookup = { [k: string]: "correct" | "inWord" | "wrong" };

export type ProcessedTurns = {
  turns: Array<PTurn>;
  correctPositions: CorrectPositions;
  guesses: GuessesLookup;
  max: number;
};
export function processTurns(turns: Array<Turns>, w: string) {
  const word = w.toUpperCase();
  const isLetterInWord = turns.map(() => getIsLetterInWord(word));

  const correctPositions: CorrectPositions = new Array(word.length)
    .fill(null)
    .map((position, i) => {
      return (
        turns
          .find((t, j) => {
            // Loop first to remove correct letters from the count so the first instance of the
            // letter isn't considered the correct one
            const guess = t.guess.toUpperCase();
            const isMatch = guess[i] === word[i];
            if (isMatch) isLetterInWord[j](guess[i]); // Reduce counter
            return isMatch;
          })
          ?.guess[i].toUpperCase() || position
      );
    });

  return turns.reduce(
    (acc: ProcessedTurns, turn, turnIndex) => {
      acc.turns.push(
        turn.guess
          .toUpperCase()
          .split("")
          .map((letter, letterIndex) => {
            const isCorrect =
              acc.correctPositions[letterIndex]?.toUpperCase() ===
              letter.toUpperCase();
            const isInWord = !isCorrect && isLetterInWord[turnIndex](letter);
            acc.guesses[letter] = isCorrect
              ? "correct"
              : isInWord
              ? "inWord"
              : "wrong";

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
      max: getNumberOfRounds(),
    }
  );
}

function getIsLetterInWord(word: string) {
  const lookup = word
    .toUpperCase()
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

export function getNumberOfRounds() {
  return process.env.TURN_COUNT ? Number(process.env.TURN_COUNT) : 5;
}

export function userStillHasTurns(turns: Array<PTurn | Turns>) {
  const rounds = getNumberOfRounds();
  return turns.length < rounds;
}

export function getGameStatus(processedTurns: ProcessedTurns) {
  const hasWon = processedTurns.correctPositions.every((p) => p !== null);
  const isOver = hasWon || !userStillHasTurns(processedTurns.turns);
  return { hasWon, isOver };
}

export async function getRawFormData(meta: RequestMeta) {
  let formData = getFromRequest(meta, "formData");
  if (!formData) {
    formData = await meta.request.formData();
    saveToRequest(meta, { formData });
  }

  return formData;
}

export async function getFormData(meta: RequestMeta, keys?: Array<string>) {
  const formData = await getRawFormData(meta);

  if(!keys) {
    return formData;
  }
  
  const toReturn = keys.reduce((acc: StringObject, cur: string) => {
    const data = formData?.get(cur);
    if (typeof data === "string") {
      acc[cur] = data;
    }
    return acc;
  }, {});

  const [currentResourceValue] = meta.request.url.split("/").reverse();
  Object.entries(meta.params).forEach(([key, value]) => {
    if (value && value !== currentResourceValue) {
      toReturn[key] = value;
    }
  });

  return toReturn;
}