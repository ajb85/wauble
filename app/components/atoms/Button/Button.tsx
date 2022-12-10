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
    "bg-submitButtonBackground text-submitButtonText border-submitButtonBorder",
  cancel:
    "bg-cancelButtonBackground text-cancelButtonText border-cancelButtonBorder",
  delete:
    "bg-deleteButtonBackground text-deleteButtonText border-deleteButtonBorder",
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
