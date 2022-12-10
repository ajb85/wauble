import { createLookupForArrayObjectsByKey } from "~/utils";
import { useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

export type Colors = {
  background: string;
  text: string;
  errors: string;
  correctGuessBackground: string;
  incorrectGuessBackground: string;
  inWordGuessBackground: string;
  noGuessBackground: string;
  correctGuessText: string;
  noGuessText: string;
  incorrectGuessText: string;
  inWordGuessText: string;
  submitButtonBackground: string;
  cancelButtonBackground: string;
  deleteButtonBackground: string;
  submitButtonText: string;
  cancelButtonText: string;
  deleteButtonText: string;
  submitButtonBorder: string;
  deleteButtonBorder: string;
  cancelButtonBorder: string;
};

export type ColorTheme = {
  name: string;
  colors: Colors;
  preset?: boolean;
};

export function updateCSSColors(colorTheme: ColorTheme = defaultColorTheme) {
  const root = document.documentElement;
  const { colors } = colorTheme;

  let category: keyof Colors;
  for (category in colors) {
    const cssVar = `--color-${category}`;
    root.style.setProperty(cssVar, colors[category]);
  }
}

export const defaultColorTheme: ColorTheme = {
  name: "default",
  colors: {
    background: "227 226 226",
    text: "25 25 25",
    errors: "229 173 170",
    correctGuessBackground: "190 242 100",
    incorrectGuessBackground: "113 113 122",
    inWordGuessBackground: "253 224 71",
    noGuessBackground: "255 255 255",
    correctGuessText: "0 0 0",
    noGuessText: "0 0 0",
    incorrectGuessText: "0 0 0",
    inWordGuessText: "0 0 0",
    submitButtonBackground: "34 197 94",
    deleteButtonBackground: "159 18 57",
    cancelButtonBackground: "255 255 255",
    submitButtonText: "0 0 0",
    deleteButtonText: "0 0 0",
    cancelButtonText: "0 0 0",
    submitButtonBorder: "0 0 0",
    deleteButtonBorder: "0 0 0",
    cancelButtonBorder: "0 0 0",
  },
  preset: true,
};

const createColorThemeLookup = createLookupForArrayObjectsByKey("name");

export default function useColorTheme(
  allThemes: Array<ColorTheme>
): [ColorTheme, (s: string) => void] {
  const colorThemesLookup = useMemo(
    () => createColorThemeLookup(allThemes),
    [allThemes]
  );

  const [lastActiveThemeName, setLastActiveThemeName] = useLocalStorage(
    "lastThemeName",
    "default"
  );

  const activeColorTheme =
    colorThemesLookup[lastActiveThemeName] ?? defaultColorTheme;

  const changeActiveTheme = useCallback(
    (themeName: string) => {
      const newTheme = colorThemesLookup[themeName] ?? defaultColorTheme;
      setLastActiveThemeName(newTheme.name);
      updateCSSColors(newTheme);
    },
    [colorThemesLookup]
  );

  return [activeColorTheme, changeActiveTheme];
}
