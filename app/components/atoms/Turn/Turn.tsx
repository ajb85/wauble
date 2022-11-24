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
        if (props.correctPositions[i]?.toLowerCase() === letter.toLowerCase()) {
          return (
            <div
              key={i}
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black bg-lime-400 font-extrabold"
            >
              {letter.toUpperCase()}
            </div>
          );
        }

        const isInWord = isString ? false : char.isInWord;
        if (isInWord) {
          return (
            <div
              key={i}
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black bg-yellow-400 font-extrabold"
            >
              {letter.toUpperCase()}
            </div>
          );
        }

        if (!isString) {
          return (
            <div
              key={i}
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black bg-amber-800 font-extrabold"
            >
              {letter.toUpperCase()}
            </div>
          );
        }

        return (
          <div
            key={i}
            className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-solid border-black font-extrabold"
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
