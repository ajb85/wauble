import { useLoaderData } from "@remix-run/react";
import { useState, useCallback } from "react";
import { Keyboard, Logo } from "~/components/atoms";

import { RequestMeta } from "~/types";
import middleware, { isAuthed } from "~/middleware";
import { getUserGame } from "~/models/games.server";

export const loader = (meta: RequestMeta) =>
  middleware(meta, isAuthed, async (meta: RequestMeta) => {
    const { user } = meta.locals;
    const userGame = await getUserGame(user.id);
    return userGame;
  });

export default function Game(props: {}) {
  const turns = useLoaderData();
  const [currentTurn, setCurrentTurn] = useState("");

  const handleKeyboardSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      if (currentTurn.length < 5) {
        const key = target.textContent || target.innerText;
        setCurrentTurn((t) => t + key);
      }
    },
    []
  );

  const handleDelete = useCallback(() => {
    setCurrentTurn((turn) => turn.substring(0, turn.length - 1));
  }, []);

  return (
    <div className="ml-2 w-full">
      <Logo />
      <Keyboard
        turns={turns}
        currentTurn={currentTurn}
        onSelect={handleKeyboardSelect}
        onDelete={handleDelete}
        onSubmit={() => {}}
      />
    </div>
  );
}
