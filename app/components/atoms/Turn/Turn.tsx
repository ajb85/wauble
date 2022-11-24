import { bgColorsByType, combineClasses } from "~/utils";
import type { CorrectPositions, PTurn } from "~/utils.server";

type Props = {
  data: PTurn | Array<string>;
  correctPositions: CorrectPositions;
};

export default function Turn(props: Props) {
  return (
    <div className="my-2 flex justify-center">
      {(props.data ?? []).map((char, i) => {
        const isString = typeof char === "string";
        const letter = isString ? char : char.letter;
        const isCorrect =
          props.correctPositions[i]?.toLowerCase() === letter.toLowerCase();
        const isInWord = isString ? false : char.isInWord;
        return (
          <div
            key={i}
            className={combineClasses(
              "mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black font-extrabold",
              isCorrect
                ? bgColorsByType.correct
                : isInWord
                ? bgColorsByType.inWord
                : !isString
                ? bgColorsByType.wrong
                : ""
            )}
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
