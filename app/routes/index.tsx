import { Link } from "@remix-run/react";
import { Logo } from "~/components/atoms";
import guessesImg from "~/assets/guesses.png";
import { classNames, combineClasses } from "~/utils";

export default function Index() {
  return (
    <main className="relative h-[90vh]">
      <header
        className={combineClasses(
          "h-3/4 w-3/4 overflow-hidden drop-shadow-2xl",
          classNames.absoluteCentered
        )}
      >
        <img
          className="absolute z-10 h-full w-1/2 object-cover"
          src={guessesImg}
          alt="Wauble's guesses UI"
        />
        <img
          className="absolute right-0 h-full object-cover"
          src={guessesImg}
          alt="Wauble's guesses UI"
        />
        <div
          className={combineClasses(
            "z-20 h-full w-1/2 bg-gradient-to-r from-incorrectGuessBackground via-inWordGuessBackground to-correctGuessBackground",
            classNames.absoluteCentered
          )}
        >
          <Logo />
        </div>
        <Link to="/login">Login</Link>
        <Link to="/join">Register</Link>
      </header>
    </main>
  );
}
