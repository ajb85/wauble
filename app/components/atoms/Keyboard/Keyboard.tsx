import { bgColorsByType, bgHoverColorsByType, combineClasses } from "~/utils";
import type { GuessColors } from "~/utils";
import type { ProcessedTurns } from "~/utils.server";

const keyRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type Props = {
  turns: ProcessedTurns;
  onSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
  disabled?: boolean;
};

export default function Keyboard(props: Props) {
  const { turns } = props;
  return (
    <div>
      {keyRows.map((row, i) => (
        <div key={i} className="flex justify-center">
          {row.map((key) => {
            const status = turns.guesses[key.toUpperCase()];
            return (
              <SingleKey
                key={key}
                letter={key}
                status={status}
                disabled={props.disabled}
                onSelect={props.onSelect}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

type SingleKeyProps = {
  className?: string;
  disabled?: boolean;
  status?: keyof GuessColors;
  onSelect?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  letter: string;
};
export function SingleKey(props: SingleKeyProps) {
  return (
    <button
      disabled={props.disabled}
      type="button"
      onClick={props.onSelect}
      className={combineClasses(
        "mr-2 mb-4 flex h-8 w-8 items-center justify-center rounded-md border-2 border-solid border-black font-extrabold shadow-md",
        (props.status && bgColorsByType[props.status]) ??
          bgColorsByType.notGuessed,
        props.status !== "wrong" &&
          ((props.status && bgHoverColorsByType[props.status]) ??
            bgHoverColorsByType.notGuessed),
        props.status !== "wrong" && "cursor-pointer",
        props.className
      )}
    >
      {props.letter}
    </button>
  );
}
