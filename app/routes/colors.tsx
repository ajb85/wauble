import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import {
  combineClasses,
  hexToRGB,
  parseRGBString,
  rgbToHex,
  stopProp,
} from "~/utils";
import { ChromePicker } from "react-color";
import useColorThemes from "~/hooks/useColorThemes";
import useBodyClick from "~/hooks/useBodyClick";

import type { ColorChangeHandler } from "react-color";
import type { RequestMeta } from "~/types";
import { Logo } from "~/components/atoms";

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

  const [previewColors, setPreviewColors] = useState<
    Array<StaticColorSelectionProps>
  >([
    {
      label: "Background",
      name: "background",
      className: "bg-background",
      value: activeColorTheme.colors.background,
    },
    {
      label: "Text",
      name: "text",
      className: "bg-text",
      value: activeColorTheme.colors.text,
    },
    {
      label: "Errors",
      name: "errors",
      className: "bg-errors",
      value: activeColorTheme.colors.errors,
    },
    {
      label: "Correct Guess",
      name: "correctGuess",
      className: "bg-correctGuess",
      value: activeColorTheme.colors.correctGuess,
    },
  ]);

  const updatePreviewColors = useCallback((name: string, color: string) => {
    setPreviewColors((p) =>
      p.map((c) => (c.name === name ? { ...c, value: color } : c))
    );
  }, []);

  return (
    <div className="mx-auto w-full max-w-[450px] px-12">
      <Logo />
      <h2 className="mb-10 pt-8 text-center">Pick your game colors!</h2>
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
  const [isOpen, setIsOpen] = useState(false);
  const [r, g, b] = parseRGBString(props.value);

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

  const openColorPicker = useCallback(() => setIsOpen((v) => true), []);
  const closeColorPicker = useCallback(() => setIsOpen((v) => false), []);

  useBodyClick(closeColorPicker);

  return (
    <div
      className="border-black inline-blocks z-0 mb-6 flex w-full items-center justify-end border-2 border-solid"
      onClick={stopProp}
    >
      <label className="min-w-[120px] px-2">{props.label}</label>
      <input
        className="bg-slate-400 border-black border-l-2 border-solid p-2 text-right"
        name={props.name}
        value={props.value ? rgbToHex(props.value) : ""}
        onChange={handleInputChange}
      />
      <div
        onClick={openColorPicker}
        className="border-black relative flex cursor-pointer items-center justify-center border-l-2 border-solid p-2"
      >
        <div
          style={{ backgroundColor: rgbToHex(props.value) }}
          className={combineClasses(
            "border-black inline-block h-6 w-6 border-2 border-solid p-2"
          )}
        />
        {isOpen && (
          <div className="absolute z-10">
            <ChromePicker color={{ r, g, b }} onChange={handlePickerChange} />
          </div>
        )}
      </div>
    </div>
  );
}
