import { combineClasses } from "~/utils";

type Props = {
  size: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function LoadingIcon(props: Props) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={combineClasses(
          "spinner-grow inline-block rounded-full bg-current bg-slate-400 opacity-0",
          sizes[props.size]
        )}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
