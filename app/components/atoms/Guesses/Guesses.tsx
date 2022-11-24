import type { CorrectPositions, PTurn } from "~/utils.server";
import { Turn } from "../";

type Props = {
  correctPositions: CorrectPositions;
  currentTurn: Array<string>;
  turns: Array<PTurn>;
  gameIsOver: boolean;
};

export default function Guesses(props: Props) {
  return (
    <div className="min-h-[232px]">
      {(props.turns ?? []).map((t, i) => (
        <Turn key={i} data={t} correctPositions={props.correctPositions} />
      ))}
      {props.turns.length < 5 && !props.gameIsOver && (
        <Turn
          data={[
            ...props.currentTurn,
            ...new Array(5 - props.currentTurn.length).fill("_"),
          ]}
          correctPositions={props.correctPositions}
        />
      )}
    </div>
  );
}
