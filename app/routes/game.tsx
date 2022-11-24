import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Keyboard, Guesses, Logo } from "~/components/atoms";

import { RequestMeta } from "~/types";
import middleware, { isAuthed } from "~/middleware";
import { getUserGame } from "~/models/games.server";
import { authenticateRequest, ProcessedTurns } from "~/utils.server";
import { getFromDataFromObject } from "~/utils";
import { saveTurn } from "~/models/turns.server";

export const loader = (meta: RequestMeta) =>
  middleware(meta, isAuthed, async (meta: RequestMeta) => {
    const { user } = meta.locals;
    const userGame = await getUserGame(user.id);
    return userGame;
  });

export const action = async (meta: RequestMeta) => {
  const user = await authenticateRequest(meta);
  if (user) {
    const formData = await meta.request.formData();
    console.log("OG TURN: ", formData.get("turn"));
    const turn = JSON.parse(formData.get("turn")?.toString() ?? "");
    if (Array.isArray(turn) && turn.length === 5) {
      console.log("JOIN TURN: ", turn);
      await saveTurn(turn.join(""), user.id);
      return await getUserGame(user.id);
    }
  }

  return null;
};

export default function Game(props: {}) {
  const processedTurns: ProcessedTurns = useLoaderData();
  const actionData = useActionData();
  console.log("ACTION DATA: ", actionData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTurn, setCurrentTurn] = useState<Array<string>>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const submit = useSubmit();

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    submit(formRef.current, {
      method: "post",
      action: "/game",
    });
  }, [submit]);

  useEffect(() => {}, []);

  const handleKeyboardSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.target as HTMLButtonElement;
      const key = target.textContent || target.innerText;
      setCurrentTurn((t) => (t.length < 5 ? [...t, key] : t));
    },
    []
  );

  const handleDelete = useCallback(() => {
    setCurrentTurn((turn) => turn.slice(0, turn.length - 1));
  }, []);

  return (
    <div className="ml-2 w-full">
      <Form ref={formRef} method="post" onSubmit={handleSubmit}>
        <Logo />
        <input
          style={{ display: "none" }}
          name="turn"
          value={JSON.stringify(currentTurn)}
          readOnly
        />
        <Guesses
          correctPositions={processedTurns.correctPositions}
          turns={processedTurns.turns}
          currentTurn={currentTurn}
          gameIsOver={false}
        />
        <Keyboard
          turns={processedTurns}
          currentTurn={currentTurn}
          onSelect={handleKeyboardSelect}
          onDelete={handleDelete}
        />
      </Form>
    </div>
  );
}
