import { Link } from "@remix-run/react";
import { Logo } from "~/components/atoms";
import { classNames, combineClasses } from "~/utils";

export default function Index() {
  return (
    <main className="relative h-[90vh] text-white">
      <header
        className={combineClasses(
          "flex h-3/4 h-full w-3/4 w-full flex-col items-center overflow-hidden bg-slate-700 p-2 drop-shadow-2xl",
          classNames.absoluteCentered
        )}
      >
        <Logo />
        <nav className="flex w-1/2 justify-between py-80 text-4xl">
          <Link to="/login">Login</Link>
          <Link to="/join">Register</Link>
        </nav>
      </header>
    </main>
  );
}
