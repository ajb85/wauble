import type { CorrectPositions, GameTurn, PTurn } from "~/utils.server";
import { Turn } from "../";

type Props = {
  correctPositions: CorrectPositions;
  currentTurn: Array<GameTurn>;
  turns: Array<PTurn>;
  gameIsOver: boolean;
  isLoading: boolean;
};

export default function Guesses(props: Props) {
  return (
    <div className="mb-4">
      {(props.turns ?? []).map((t, i) => (
        <Turn key={i} data={t} correctPositions={props.correctPositions} />
      ))}
      {!props.gameIsOver && (
        <Turn
          data={props.currentTurn}
          correctPositions={props.correctPositions}
          isLoading={props.isLoading}
        />
      )}
    </div>
  );
}
