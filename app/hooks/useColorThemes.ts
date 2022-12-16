import { useCallback, useEffect, useMemo } from "react";
import { createLookupForArrayObjectsByKey } from "~/utils";
import useLocalStorage from "./useLocalStorage";
import type {
  Colors,
  ColorTheme,
  ColorThemeBase,
} from "~/models/colorThemes.server";

export function updateCSSColors(
  colorTheme: ColorTheme | ColorThemeBase = defaultColorTheme
) {
  const root = document.documentElement;
  const { colors } = colorTheme;

  let category: keyof Colors;
  for (category in colors) {
    const cssVar = `--color-${category}`;
    root.style.setProperty(cssVar, colors[category]);
  }
}

export const defaultColorTheme: ColorThemeBase = {
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
    () => createColorThemeLookup(allThemes ?? []),
    [allThemes]
  );

  const [lastActiveThemeName, setLastActiveThemeName] = useLocalStorage(
    "lastThemeName",
    "default"
  );

  const activeColorTheme =
    colorThemesLookup[lastActiveThemeName] ?? defaultColorTheme;

  useEffect(() => {
    updateCSSColors(activeColorTheme);
  }, [activeColorTheme]);

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
