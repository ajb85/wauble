import { combineClasses } from "~/utils";
import { ProcessedTurns } from "~/utils.server";

const keyRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type Props = {
  turns: ProcessedTurns;
  currentTurn: string;
  onSelect: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: () => void;
  onDelete: () => void;
};

const bgColorsByType = {
  correct: "bg-lime-300 hover:bg-lime-100",
  inWord: "bg-yellow-300 hover:bg-yellow-100",
  wrong: "bg-zing-500 hover:bg-zing-300",
  notGuessed: "shadow-slate-300 hover:bg-slate-100",
};

export default function Keyboard(props: Props) {
  const { turns, currentTurn } = props;
  return (
    <div>
      {keyRows.map((row) => (
        <div className="flex justify-center">
          {row.map((key) => (
            <button
              onClick={props.onSelect}
              className={combineClasses(
                "mr-2 mb-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-2 border-solid border-black font-extrabold shadow-md",
                bgColorsByType[turns.guesses[key]] ?? bgColorsByType.notGuessed
              )}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <button
        disabled={turns.turns.length >= 5 || currentTurn.length < 5}
        className="mr-10"
        onClick={props.onSubmit}
      >
        ✓
      </button>
      <button onClick={props.onDelete}>{"<<"}</button>
    </div>
  );
}
