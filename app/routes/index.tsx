import { Link } from "@remix-run/react";
import { Logo, Line } from "~/components/atoms";
import { classNames, combineClasses } from "~/utils";

export default function Index() {
  return (
    <main className="relative h-[90vh] text-white">
      <section
        className={combineClasses(
          "flex w-3/4 max-w-lg flex-col items-center overflow-hidden bg-slate-700 py-4 px-6 drop-shadow-2xl",
          classNames.absoluteCentered
        )}
      >
        <Line className="mt-2" length="w-full" />
        <Logo />
        <p className="pb-2 text-center">
          A Scrabble dictionary word guessing game
        </p>
        <Line length="w-full" />
        <Line vertical length="h-8" thickness="w-[2px]" />
        <nav className="flex">
          <SquareLink className="border-r-[1px] border-l-[2px]" to="/login">
            Login
          </SquareLink>
          <SquareLink className="border-l-[1px] border-r-[2px]" to="/join">
            Register
          </SquareLink>
        </nav>
      </section>
    </main>
  );
}

function SquareLink(props: {
  to: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      className={combineClasses(
        "block w-40 border-y-[2px] border-solid border-white p-2 text-center hover:bg-white hover:text-slate-700",
        props.className
      )}
      to={props.to}
    >
      {props.children}
    </Link>
  );
}
