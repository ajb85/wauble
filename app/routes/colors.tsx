import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { hexToRGB, parseRGBString, rgbToHex, trailingDebounce } from "~/utils";
import { ChromePicker } from "react-color";
import useColorThemes, { updateCSSColors } from "~/hooks/useColorThemes";
import useBodyClick from "~/hooks/useBodyClick";
import { IoMdArrowRoundBack } from "react-icons/io";

import type { ColorChangeHandler } from "react-color";
import type { ColorTheme, Colors } from "~/models/colorThemes.server";
import type { RequestMeta } from "~/types";
import { Button, ErrorMessage, Logo, Select } from "~/components/atoms";
import { TurnCharacter } from "~/components/atoms/Turn/Turn";
import { SingleKey } from "~/components/atoms/Keyboard/Keyboard";
import { getFormData, getFromRequest } from "~/utils.server";
import middleware, { isAuthed } from "~/middleware";
import * as ColorThemeQueries from "~/models/colorThemes.server";
import { loadUserColorsTerminal } from "~/middleware/loadUserColors";

type Props = {};
type ActionFormErrors = { name?: string };
type ActionResults =
  | undefined
  | { data?: ColorTheme; errors: ActionFormErrors };

export const loader = (meta: RequestMeta) =>
  middleware(meta, isAuthed, loadUserColorsTerminal);

export const action = (meta: RequestMeta) =>
  middleware(
    meta,
    isAuthed,
    async (meta: RequestMeta): Promise<ActionResults> => {
      try {
        const { name, ...submittedColors } = await getFormData(meta);
        const user = getFromRequest(meta, "user");

        const existingPreset =
          await ColorThemeQueries.getPresetColorThemeByName(name);

        if (existingPreset) {
          return {
            errors: { name: "Cannot use the same name as a preset theme." },
          };
        }

        const colors = ColorThemeQueries.colorKeys.reduce(
          (acc: Colors, key) => {
            if (acc[key] && submittedColors[key]) {
              acc[key] = hexToRGB(submittedColors[key]);
            }
            return acc;
          },
          ColorThemeQueries.getNewColor()
        );

        const upsertedTheme = await ColorThemeQueries.upsertUsersColorTheme(
          { name, colors },
          user.id
        );

        if (!upsertedTheme) {
          throw new Error("No upsert");
        }

        return { data: upsertedTheme, errors: {} };
      } catch (err) {
        return { errors: { name: "Whoops, something broke :(" } };
      }
    }
  );

export type PreviewColor = Array<StaticColorSelectionProps>;
type ThemeChangeHandler = (name: keyof Colors, color: string) => void;

export default function ColorsPage(props: Props) {
  const submit = useSubmit();
  const colorThemes: Array<ColorTheme> = useLoaderData();
  const actionData: ActionResults = useActionData();
  const formErrors = actionData?.errors;

  const [activeColorTheme, setActiveColorTheme] = useColorThemes(colorThemes);
  const [themeName, setThemeName] = useState<string>("");

  const [previewTheme, setPreviewTheme] =
    useState<ColorTheme>(activeColorTheme);

  const updatePreviewTheme: ThemeChangeHandler = useCallback((name, color) => {
    setPreviewTheme((theme) => ({
      ...theme,
      colors: { ...theme.colors, [name]: color },
    }));
  }, []);

  const resetPreviewTheme = useCallback(() => {
    setPreviewTheme(activeColorTheme);
    setThemeName(activeColorTheme.preset ? "" : activeColorTheme.name);
  }, [activeColorTheme]);

  // Update colors to new theme if the active theme changes
  useEffect(resetPreviewTheme, [resetPreviewTheme]);

  useEffect(() => {
    updateCSSColors(previewTheme);
  }, [previewTheme]);

  const hasBeenChanged = hasThemeChanged(previewTheme, activeColorTheme);

  const handleSelect = useCallback(
    (e: React.ChangeEvent) =>
      setActiveColorTheme((e.target as HTMLSelectElement).value),
    []
  );

  const handleThemeNameChange = useCallback(
    (e: React.ChangeEvent) =>
      setThemeName((e.target as HTMLInputElement).value),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      console.log("SAVE", themeName);
      setActiveColorTheme(themeName);
      submit(e.target as HTMLFormElement, {
        method: "post",
        action: "/colors",
      });
    },
    [themeName, submit]
  );

  return (
    <div className="relative mx-auto w-full max-w-[450px] px-12">
      <Link to="/game" className="absolute top-3 left-3 text-4xl">
        <IoMdArrowRoundBack />
      </Link>
      <Logo />
      <h2 className="mb-10 pt-8 text-center">Pick your game colors!</h2>
      <Form method="post" onSubmit={handleSubmit}>
        <ThemeControls
          activeColorTheme={activeColorTheme}
          colorThemes={colorThemes}
          onSelect={handleSelect}
          onNameChange={handleThemeNameChange}
          themeName={themeName}
          disableSubmitButton={hasBeenChanged}
          resetColors={resetPreviewTheme}
          formErrors={formErrors}
        />
        <ColorGroup
          title="App"
          example={
            <div>
              <p>This is example text</p>
              <p className="text-errors">This is an example error</p>
            </div>
          }
          theme={previewTheme}
          onThemeChange={updatePreviewTheme}
          colors={[
            { label: "Background", key: "background" },
            { label: "Text", key: "text" },
            { label: "Errors", key: "errors" },
          ]}
        />
        <ColorGroup
          title="Guesses and Keyboard"
          example={
            <div>
              <div className="flex">
                <TurnCharacter
                  isCorrect={false}
                  isInWord={false}
                  isPTurn={false}
                  letter="T"
                />
                <TurnCharacter
                  isCorrect={false}
                  isInWord
                  isPTurn={false}
                  letter="E"
                />
                <TurnCharacter
                  isCorrect={false}
                  isInWord={false}
                  isPTurn
                  letter="S"
                />
                <TurnCharacter
                  isCorrect
                  isInWord={false}
                  isPTurn={false}
                  letter="T"
                />
              </div>
              <div className="mt-4 flex">
                <SingleKey className="mx-1" letter="T" status="notGuessed" />
                <SingleKey className="mx-2" letter="E" status="inWord" />
                <SingleKey className="mx-2" letter="S" status="wrong" />
                <SingleKey className="mx-2" letter="T" status="correct" />
              </div>
            </div>
          }
          theme={previewTheme}
          onThemeChange={updatePreviewTheme}
          colors={[
            { label: "No Guess BG", key: "noGuessBackground" },
            { label: "No Guess Text", key: "noGuessText" },
            { label: "Wrong Place BG", key: "inWordGuessBackground" },
            { label: "Wrong Place Text", key: "inWordGuessText" },
            { label: "Incorrect Guess BG", key: "incorrectGuessBackground" },
            { label: "Incorrect Guess Text", key: "incorrectGuessText" },
            { label: "Correct Guess BG", key: "correctGuessBackground" },
            { label: "Correct Guess Text", key: "correctGuessText" },
          ]}
        />
        <ColorGroup
          title="Buttons"
          example={
            <div>
              <Button className="mx-2" type="button" theme="submit">
                Submit
              </Button>
              <Button className="mx-2" type="button" theme="delete">
                {"<<"}
              </Button>
              <Button className="mx-2" type="button" theme="cancel">
                Cancel
              </Button>
            </div>
          }
          theme={previewTheme}
          onThemeChange={updatePreviewTheme}
          colors={[
            { label: "Submit Background", key: "submitButtonBackground" },
            { label: "Submit Text", key: "submitButtonText" },
            { label: "Delete Background", key: "deleteButtonBackground" },
            { label: "Delete Text", key: "deleteButtonText" },
            { label: "Cancel Background", key: "cancelButtonBackground" },
            { label: "Cancel Text", key: "cancelButtonText" },
          ]}
        />
      </Form>
    </div>
  );
}

function hasThemeChanged(
  previewTheme: ColorTheme,
  activeColorTheme: ColorTheme
) {
  for (let color in previewTheme.colors) {
    const newValue = previewTheme.colors[color as keyof Colors];
    const oldValue = activeColorTheme.colors[color as keyof Colors];
    if (oldValue !== newValue) {
      return true;
    }
  }

  return false;
}

type ThemeControlsProps = {
  activeColorTheme: ColorTheme;
  colorThemes: Array<ColorTheme>;
  onSelect: (e: React.ChangeEvent) => void;
  onNameChange: (e: React.ChangeEvent) => void;
  themeName: string;
  disableSubmitButton: boolean;
  resetColors: () => void;
  formErrors?: ActionFormErrors;
};
function ThemeControls(props: ThemeControlsProps) {
  const { activeColorTheme, onSelect, colorThemes, themeName } = props;

  const colorOptions = useMemo(
    () =>
      colorThemes.map((ct) => ({
        label: ct.name,
        value: ct.name,
      })),
    [colorThemes]
  );

  return (
    <section className="bg-white py-2 px-4 text-black">
      <Select
        label="Color Theme"
        value={activeColorTheme.name}
        onSelect={onSelect}
        options={colorOptions}
      />
      {props.disableSubmitButton ? (
        <div className="flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <input
              type="text"
              name="name"
              value={themeName}
              placeholder="Theme Name"
              className="border-2 border-solid border-black p-2"
              onChange={props.onNameChange}
            />
            <div className="ml-2 flex">
              <Button
                className="block"
                type="submit"
                disabled={!themeName.length}
                theme="submit"
              >
                Save
              </Button>
              <Button
                className="ml-2"
                type="button"
                theme="cancel"
                onClick={props.resetColors}
              >
                Cancel
              </Button>
            </div>
          </div>
          <ErrorMessage>{props.formErrors?.name}</ErrorMessage>
        </div>
      ) : (
        <div className="mb-4 min-h-[44px]" />
      )}
    </section>
  );
}

interface StaticColorSelectionProps {
  label: string;
  name: string;
  className: string;
  value: string;
}
type ColorProp = {
  key: keyof Colors;
  label: string;
};
type ColorGroupProps = {
  title: string;
  example: JSX.Element;
  theme: ColorTheme;
  onThemeChange: ThemeChangeHandler;
  colors: Array<ColorProp>;
};
function ColorGroup(props: ColorGroupProps) {
  const { onThemeChange } = props;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onThemeChange(name as keyof Colors, hexToRGB(value));
    },
    [onThemeChange]
  );

  const debouncedHandleInputChange = useMemo(
    () => trailingDebounce(handleInputChange, { delay: 1000 }),
    [handleInputChange]
  );

  return (
    <section className="mb-6">
      <h3 className="text-center text-2xl font-bold">{props.title}</h3>
      {props.colors.map(({ key, label }) => {
        const value = props.theme.colors[key];

        return (
          <div
            key={key}
            className="flex items-center justify-between bg-white p-2 text-black"
          >
            <label className="mr-2 block w-full text-right">{label}</label>
            <ColorChangerInput
              name={key}
              value={value}
              onChange={debouncedHandleInputChange}
            />
            <ColorChanger value={value} onChange={onThemeChange} name={key} />
          </div>
        );
      })}
      <div className="border-md flex flex-col items-center justify-center rounded-br-md rounded-bl-md border-2 border-white">
        <p className="w-full border-b-2 border-white text-center text-lg">
          Example
        </p>
        <div className="p-2">{props.example}</div>{" "}
      </div>
    </section>
  );
}

type ColorChangerInputProps = {
  name: keyof Colors;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
function ColorChangerInput(props: ColorChangerInputProps) {
  const { onChange } = props;
  const [value, setValue] = useState(rgbToHex(props.value));

  useEffect(() => {
    setValue(rgbToHex(props.value));
  }, [props.value]);

  const updateValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const validHexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    const value =
      e.target.value[0] === "#" ? e.target.value : "#" + e.target.value;

    if (validHexRegex.test(value)) {
      e.target.value = value;
      onChange(e);
    }

    setValue(value);
  }, []);

  return (
    <input
      className="w-[150px] border-solid border-black bg-slate-200 p-2 text-right"
      name={props.name}
      value={value}
      onChange={updateValue}
    />
  );
}

type ColorChangerProps = {
  value: string;
  onChange: ThemeChangeHandler;
  name: keyof Colors;
};
function ColorChanger(props: ColorChangerProps) {
  const { onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [r, g, b] = parseRGBString(props.value);

  const openColorPicker = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(() => true);
  }, []);
  const closeColorPicker = useCallback(() => setIsOpen(() => false), []);

  useBodyClick(closeColorPicker);

  const handlePickerChange: ColorChangeHandler = useCallback(
    (color) => {
      const rgbString = `${color.rgb.r} ${color.rgb.g} ${color.rgb.b}`;
      onChange(props.name, rgbString);
    },
    [props.name, onChange]
  );

  return (
    <div
      onClick={openColorPicker}
      className="relative mr-2 flex cursor-pointer items-center justify-center bg-white"
    >
      <div
        style={{ backgroundColor: rgbToHex(props.value) }}
        className="inline-block h-10 w-10 border-2 border-solid border-black p-2"
      />
      {isOpen && (
        <div className="absolute z-10">
          <ChromePicker color={{ r, g, b }} onChange={handlePickerChange} />
        </div>
      )}
    </div>
  );
}
