import { combineClasses } from "~/utils";

export type ButtonThemes = {
  submit: string;
  cancel: string;
};

type Props = {
  type?: "button" | "submit" | "reset";
  children: JSX.Element | string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  theme: keyof ButtonThemes;
};

const themeToColors: ButtonThemes = {
  submit: "",
  cancel: "",
};

export default function Button(props: Props) {
  return (
    <button
      className={combineClasses(props.className, "")}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
