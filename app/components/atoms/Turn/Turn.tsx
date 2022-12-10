import { bgColorsByType, combineClasses } from "~/utils";
import type { CorrectPositions, GameTurn, PTurn } from "~/utils.server";
import LoadingIcon from "../LoadingIcon/LoadingIcon";

type Props = {
  data: PTurn | Array<GameTurn>;
  correctPositions: CorrectPositions;
  isLoading?: boolean;
};

export default function Turn(props: Props) {
  return (
    <div className="my-2 flex justify-center">
      {(props.data ?? []).map((char, i) => {
        const isPTurn = "isInWord" in char;
        const { letter } = char;
        const isCorrect =
          props.correctPositions[i]?.toUpperCase() === letter.toUpperCase();
        const isInWord = isPTurn ? char.isInWord : false;

        return (
          <TurnCharacter
            key={i}
            isCorrect={isCorrect}
            isInWord={isInWord}
            isPTurn={isPTurn}
            letter={letter}
            isLoading={props.isLoading}
          />
        );
      })}
    </div>
  );
}

type TurnCharacterProps = {
  isCorrect: boolean;
  isInWord: boolean;
  isPTurn: boolean;
  isLoading?: boolean;
  letter: string;
};
export function TurnCharacter(props: TurnCharacterProps) {
  return (
    <div
      className={combineClasses(
        "mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black font-extrabold",
        props.isCorrect
          ? bgColorsByType.correct
          : props.isInWord
          ? bgColorsByType.inWord
          : props.isPTurn
          ? bgColorsByType.wrong
          : bgColorsByType.notGuessed
      )}
    >
      {props.isLoading ? <LoadingIcon size="sm" /> : props.letter.toUpperCase()}
    </div>
  );
}
