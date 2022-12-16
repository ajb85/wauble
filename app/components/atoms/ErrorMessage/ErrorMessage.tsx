import { combineClasses } from "~/utils";

type Props = {
  className?: string;
  children: JSX.Element | string | undefined | null;
};

export default function ErrorMessage(props: Props) {
  if (!props.children) {
    return null;
  }

  return (
    <p className={combineClasses("text-errors", props.className)}>
      {props.children}
    </p>
  );
}
