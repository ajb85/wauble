import { combineClasses } from "~/utils";

export type ButtonThemes = {
  submit: string;
  cancel: string;
  delete: string;
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
  submit:
    "bg-submitButtonBackground text-submitButtonText border-submitButtonText",
  cancel:
    "bg-cancelButtonBackground text-cancelButtonText border-cancelButtonText",
  delete:
    "bg-deleteButtonBackground text-deleteButtonText border-deleteButtonText",
};

export default function Button(props: Props) {
  return (
    <button
      className={combineClasses(
        props.className,
        themeToColors[props.theme],
        "rounded-md border-2 border-solid p-2",
        props.disabled && "opacity-40"
      )}
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
