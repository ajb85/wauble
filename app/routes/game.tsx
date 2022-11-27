import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Keyboard, Guesses, Logo } from "~/components/atoms";

import { RequestMeta } from "~/types";
import middleware, { isAuthed } from "~/middleware";
import {
  getGameForUser,
  getProcessedGameForUser,
  ProcessedGame,
} from "~/models/games.server";
import {
  authenticateRequest,
  getGameStatus,
  processTurns,
} from "~/utils.server";
import type { GameTurn } from "~/utils.server";
import { combineClasses } from "~/utils";
import { getTurnsForGame, saveTurn } from "~/models/turns.server";
import GameOverModal from "~/components/atoms/GameOverModal/GameOverModal";
import { supabase } from "~/db.server";

export const loader = (meta: RequestMeta) =>
  middleware(meta, isAuthed, async (meta: RequestMeta) => {
    const { user } = meta.locals;
    const userGame = await getProcessedGameForUser(user.id);
    return userGame;
  });

export const action = async (meta: RequestMeta) => {
  const user = await authenticateRequest(meta);
  if (user) {
    const formData = await meta.request.formData();
    const turn: Array<GameTurn> = JSON.parse(
      formData.get("turn")?.toString() ?? ""
    );

    const playAgain = formData.get("playAgain");
    if (playAgain) {
      const currentGame = await getGameForUser(user.id);
      const turns = await getTurnsForGame(currentGame.id);
      const { data: gameWord } = await supabase
        .from("Words")
        .select("word")
        .eq("id", currentGame.word_id)
        .limit(1)
        .single();

      if (gameWord) {
        const { isOver, hasWon } = getGameStatus(
          processTurns(turns, gameWord.word)
        );

        if (isOver) {
          const { Words, ...g } = currentGame;
          await supabase
            .from("Games")
            .update({ ...g, score: hasWon ? 1 : -1 })
            .eq("id", currentGame.id);
          return null;
        }
      }
    }

    const turnWord = turn.reduce((acc: string, cur) => acc + cur.letter, "");
    if (Array.isArray(turn) && !turnWord.includes("_")) {
      await saveTurn(turn.map(({ letter }) => letter).join(""), user.id);
      return await getProcessedGameForUser(user.id);
    }
  }

  return null;
};

export default function Game(props: {}) {
  const { processedTurns, isOver, hasWon, word }: ProcessedGame =
    useLoaderData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<Array<GameTurn>>(
    new Array(5).fill({ letter: "_" })
  );

  useEffect(() => {
    setIsLoading(false);

    setCurrentTurn((turn) =>
      turn.map((_, i) => {
        const cPosition = processedTurns.correctPositions[i];
        return {
          letter: cPosition ?? "_",
          isCorrect: cPosition !== null ? true : undefined,
        };
      })
    );
  }, [processedTurns.correctPositions]);

  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    submit(formRef.current, {
      method: "post",
      action: "/game",
    });
  }, [submit]);

  const handleKeyboardSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      const key = target.textContent || target.innerText;
      setCurrentTurn((t) => {
        let hasFoundUnderscore = false;
        return t.map((letterGuess) => {
          if (letterGuess.letter === "_" && !hasFoundUnderscore) {
            hasFoundUnderscore = true;
            return { letter: key };
          }
          return letterGuess;
        });
      });
    },
    []
  );

  const handleDelete = useCallback(() => {
    setCurrentTurn((turn) => {
      const newTurn: Array<GameTurn> = [];
      let didFindLetter = false;
      for (let i = turn.length - 1; i >= 0; i--) {
        const isNotUserGuess =
          turn[i].letter === "_" || turn[i].isCorrect === true;
        if (!didFindLetter && !isNotUserGuess) {
          didFindLetter = true;
          newTurn.unshift({ letter: "_" });
        } else {
          newTurn.unshift(turn[i]);
        }
      }

      return newTurn;
    });
  }, []);

  const isSubmitDisabled =
    isLoading || currentTurn.some(({ letter }) => letter === "_") || isOver;

  const guessesGameBoard = (
    <Guesses
      correctPositions={processedTurns.correctPositions}
      turns={processedTurns.turns}
      currentTurn={currentTurn}
      gameIsOver={isOver}
      isLoading={isLoading}
    />
  );
  return (
    <div className="ml-2 w-[98%]">
      <Form
        ref={formRef}
        method="post"
        onSubmit={handleSubmit}
        className="mx-auto flex h-screen max-w-[400px] flex-col justify-between"
      >
        <div>
          <GameOverModal isOver={isOver} hasWon={hasWon} word={word ?? ""}>
            {guessesGameBoard}
          </GameOverModal>
          <Logo isLoading={isLoading} />
          <input
            style={{ display: "none" }}
            name="turn"
            value={JSON.stringify(currentTurn)}
            readOnly
          />
          {guessesGameBoard}
        </div>
        <div className="pb-4">
          <div className="mt-2">
            <Keyboard
              turns={processedTurns}
              onSelect={handleKeyboardSelect}
              onDelete={handleDelete}
              disabled={isOver || isLoading}
            />
          </div>
          <div className={combineClasses("flex justify-center")}>
            <button
              disabled={isSubmitDisabled}
              className={combineClasses(
                "mr-10 h-10 w-1/2 rounded-md border-2 border-solid border-green-900",
                isSubmitDisabled
                  ? "bg-green-700 text-slate-400"
                  : "bg-green-500 text-white"
              )}
              type="submit"
            >
              Submit Turn
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={combineClasses(
                "w-1/4 rounded-md bg-rose-800 text-white"
              )}
            >
              {"<<"}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
