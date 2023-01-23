import { combineClasses } from "~/utils";

type Props = {
  vertical?: boolean;
  dark?: boolean;
  className?: string;
  length?: string;
  thickness?: string;
};

export default function Line(props: Props) {
  return (
    <div
      className={combineClasses(
        props.dark ? "bg-black" : "bg-white",
        props.length ?? (props.vertical ? "h-full" : "w-full"),
        props.thickness ?? (props.vertical ? "w-px" : "h-px"),
        props.className
      )}
    />
  );
}
