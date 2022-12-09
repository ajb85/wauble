import { Form, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  hexToRGB,
  parseRGBString,
  rgbToHex,
  stopProp,
  toDisplayCase,
} from "~/utils";
import { ChromePicker } from "react-color";
import useColorThemes, { Colors } from "~/hooks/useColorThemes";
import useBodyClick from "~/hooks/useBodyClick";

import type { ColorChangeHandler } from "react-color";
import type { ColorTheme } from "~/hooks/useColorThemes";
import type { RequestMeta } from "~/types";
import { Button, Logo, Select } from "~/components/atoms";

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
      preset: true,
    },
    {
      name: "custom",
      colors: {
        background: "227 226 226",
        text: "25 25 25",
        errors: "0 173 170",
        correctGuess: "113 113 122",
        incorrectGuess: "190 242 100",
        inWordGuess: "0 0 0",
        noGuess: "253 224 71",
      },
    },
  ];
};

export type PreviewColor = Array<StaticColorSelectionProps>;

export default function Colors(props: Props) {
  const colorThemes: Array<ColorTheme> = useLoaderData();
  const [activeColorTheme, setActiveColorTheme] = useColorThemes(colorThemes);
  const [themeName, setThemeName] = useState<string>("");
  const convertedColorTheme = useMemo(
    () => convertThemeToPreview(activeColorTheme),
    [activeColorTheme]
  );
  const [previewColors, setPreviewColors] =
    useState<PreviewColor>(convertedColorTheme);

  const updatePreviewColors = useCallback((name: string, color: string) => {
    setPreviewColors((p) =>
      p.map((c) => (c.name === name ? { ...c, value: color } : c))
    );
  }, []);

  const resetPreviewColors = useCallback(() => {
    setPreviewColors(convertedColorTheme);
    setThemeName(activeColorTheme.preset ? "" : activeColorTheme.name);
  }, [activeColorTheme, convertedColorTheme]);

  // Update colors to new theme if the active theme changes
  useEffect(() => {
    resetPreviewColors;
  }, [resetPreviewColors]);

  const hasBeenChanged =
    !previewColors.every(
      (c) => c.value === activeColorTheme.colors[c.name as keyof Colors]
    ) || true;

  return (
    <div className="mx-auto w-full max-w-[450px] px-12">
      <Logo />
      <h2 className="mb-10 pt-8 text-center">Pick your game colors!</h2>
      <Select
        label="Color Theme"
        value={activeColorTheme.name}
        onSelect={(e) =>
          setActiveColorTheme((e.target as HTMLTextAreaElement).value)
        }
        options={colorThemes.map((ct) => ({
          label: ct.name,
          value: ct.name,
        }))}
      />
      {hasBeenChanged && (
        <Form className="flex w-[100px] items-center">
          <input
            type="text"
            name="name"
            value={themeName}
            placeholder="Theme Name"
            className="border-black border-2 border-solid p-2"
          />
          <Button
            className="mx-2 block"
            type="submit"
            disabled={!themeName.length}
          >
            Save
          </Button>
          <Button type="button" onClick={resetPreviewColors}>
            Cancel
          </Button>
        </Form>
      )}
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
      const validHexRegex = /^#([0-9A-F]{3}){1,2}$/i;
      if (validHexRegex.test(value)) {
        onChange(name, hexToRGB(value));
      }
    },
    [onChange]
  );

  const openColorPicker = useCallback(() => setIsOpen(() => true), []);
  const closeColorPicker = useCallback(() => setIsOpen(() => false), []);

  useBodyClick(closeColorPicker);

  return (
    <div
      className="border-black inline-blocks z-0 mb-6 flex w-full items-center justify-end rounded-md border-2 border-solid"
      onClick={stopProp}
    >
      <label className="px-2">{props.label}</label>
      <input
        className="bg-slate-400 border-black w-[150px] border-l-2 border-solid p-2 text-right"
        name={props.name}
        value={props.value ? rgbToHex(props.value) : ""}
        onChange={handleInputChange}
      />
      <div
        onClick={openColorPicker}
        className="border-black bg-white relative flex cursor-pointer items-center justify-center border-l-2 border-solid p-2"
      >
        <div
          style={{ backgroundColor: rgbToHex(props.value) }}
          className="border-black inline-block h-6 w-6 border-2 border-solid p-2"
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

function convertThemeToPreview(activeColorTheme: ColorTheme) {
  return Object.keys(activeColorTheme.colors).map((c: string) => ({
    label: toDisplayCase(c),
    name: `${c}`,
    className: `bg-${c}`,
    value: activeColorTheme.colors[c as keyof Colors],
  }));
}
