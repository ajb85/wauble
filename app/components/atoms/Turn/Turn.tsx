import { bgColorsByType, combineClasses } from "~/utils";
import type {
  CorrectPositions,
  GameTurn,
  PTurn,
  SinglePTurn,
} from "~/utils.server";
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
          <div
            key={i}
            className={combineClasses(
              "mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black font-extrabold",
              isCorrect
                ? bgColorsByType.correct
                : isInWord
                ? bgColorsByType.inWord
                : isPTurn
                ? bgColorsByType.wrong
                : ""
            )}
          >
            {props.isLoading ? <LoadingIcon size="sm" /> : letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
