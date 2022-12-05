import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import { combineClasses, hexToRGB } from "~/utils";
import { ChromePicker } from "react-color";
import useColorThemes from "~/hooks/useColorThemes";

import type { ColorChangeHandler, ColorResult } from "react-color";
import type { RequestMeta } from "~/types";

type Props = {};

export const loader = (meta: RequestMeta) => {
  return [
    {
      name: "default",
      colors: {
        background: "25 25 25",
        text: "227 226 226",
        errors: "229 173 170",
        correctGuess: "190 242 100",
        incorrectGuess: "113 113 122",
        inWordGuess: "253 224 71",
        noGuess: "0 0 0",
      },
    },
  ];
};

export default function Colors(props: Props) {
  const colorThemes = useLoaderData();
  const [activeColorTheme, setActiveColorTheme] = useColorThemes(colorThemes);
  console.log("ACT: ", activeColorTheme/);

  const [previewColors, setPreviewColors] = useState<
    Array<StaticColorSelectionProps>
  >([
    {
      label: "Background",
      name: "background",
      className: "bg-background",
      value: activeColorTheme.background,
    },
    {
      label: "Text",
      name: "text",
      className: "bg-text",
      value: activeColorTheme.text,
    },
    {
      label: "Errors",
      name: "errors",
      className: "bg-errors",
      value: activeColorTheme.errors,
    },
    {
      label: "Correct Guess",
      name: "correctGuess",
      className: "bg-correctGuess",
      value: activeColorTheme.correctGuess,
    },
  ]);
  console.log("PREVIEW: ", previewColors);
  const updatePreviewColors = useCallback((name: string, color: string) => {
    setPreviewColors((p) =>
      p.map((c) => (c.name === name ? { ...c, value: color } : c))
    );
  }, []);

  return (
    <div className="mx-auto w-1/2">
      <h2 className="mb-10">Pick your game colors!</h2>
      <Form>
        {previewColors.map((c) => (
          <ColorSelectionGroup
            key={c.name}
            label={c.label}
            onChange={updatePreviewColors}
            name={c.name}
            value={c.value}
            className={c.className}
          />
        ))}
      </Form>
    </div>
  );
}

interface StaticColorSelectionProps {
  label: string;
  name: string;
  className: string;
  value: string;
}
interface ColorSelectionProps extends StaticColorSelectionProps {
  onChange: (name: string, value: string) => void;
}
function ColorSelectionGroup(props: ColorSelectionProps) {
  const { onChange } = props;

  const handlePickerChange: ColorChangeHandler = useCallback(
    (color) => {
      const rgbString = `${color.rgb.r} ${color.rgb.g} ${color.rgb.b}`;
      onChange(props.name, rgbString);
    },
    [props.name, onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const isValidHex = /^#([0-9A-F]{3}){1,2}$/i;
      if (isValidHex.test(value)) {
        onChange(name, hexToRGB(value));
      }
    },
    [onChange]
  );

  if (!props.value) {
    return null;
  }

  const [r, g, b] = props.value?.split(" ").map((val) => Number(val)) ?? [
    "",
    "",
    "",
  ];

  return (
    <label className="border-black inline-blocks mb-6 flex w-full items-center justify-end border-2 border-solid">
      {props.label}
      <input
        className="bg-slate-400 border-black mx-2 border-l-2 border-solid p-2 text-right"
        name={props.name}
        value={props.value}
        onChange={handleInputChange}
      />
      <div className="border-black relative flex cursor-pointer items-center justify-center border-l-2 border-solid p-2">
        <div
          className={combineClasses(
            "border-black inline-block h-6 w-6 border-2 border-solid p-2",
            props.className
          )}
        />
        <ChromePicker color={{ r, g, b }} onChange={handlePickerChange} />
      </div>
    </label>
  );
}
