import { combineClasses } from "~/utils";
import "./Logo.css";

type Props = {
  isLoading?: boolean;
  className?: string;
};
export default function Logo(props: Props) {
  return (
    <h1
      className={combineClasses(
        "py-2 text-center font-logo text-4xl font-bold",
        props.isLoading && "animate-shake-text",
        props.className
      )}
    >
      Wauble
    </h1>
  );
}
