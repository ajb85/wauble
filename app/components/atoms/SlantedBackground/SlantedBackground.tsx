import { combineClasses } from "~/utils";
type Props = {
  className?: string;
  skew: number;
  children: React.ReactNode;
};

export default function SlantedBackground(props: Props) {
  // Absolute positions/skew are not applying
  return (
    <div
      className={combineClasses(
        props.className,
        "before:absolute before:top-0 before:bottom-0 before:left-0 before:block before:w-[300px]",
        `before:skew-x-[${props.skew}deg]`
      )}
    >
      {props.children}
    </div>
  );
}
