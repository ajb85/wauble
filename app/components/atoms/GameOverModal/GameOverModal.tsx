import { Form } from "@remix-run/react";
import Modal from "../Modal/Modal";

type Props = {
  isOver: boolean;
  hasWon: boolean;
  word: string;
  children: JSX.Element;
};

export default function GameOverModal(props: Props) {
  const title = props.hasWon ? "Victory" : "Defeat";
  const description = props.hasWon ? descriptions.won : descriptions.lost;
  return (
    <Modal isOpen={props.isOver}>
      <div className="flex w-[400px] flex-col items-center justify-center">
        <h2 className="mt-4 mb-4 text-center font-logo text-6xl font-bold">
          {title}
        </h2>
        <input readOnly className="hidden" name="playAgain" value={"true"} />
        <h3 className="text-2xl uppercase">{props.word}</h3>
        {props.children}
        <p className="p-4 pt-0 text-center text-xl">{description}</p>
        <button
          type="submit"
          className="mb-4 h-10 w-1/2 rounded-md border-2 border-solid border-green-900 hover:bg-green-200"
        >
          Play again?
        </button>
      </div>
    </Modal>
  );
}

const descriptions = {
  won: "Congrats, you figured it out! Try again?",
  lost: "Oh, the burning shame! Probably was just a bullshit word though, right?",
};
