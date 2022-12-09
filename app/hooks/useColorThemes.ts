import { createLookupForArrayObjectsByKey } from "~/utils";
import { useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

export type Colors = {
  background: string;
  text: string;
  errors: string;
  correctGuess: string;
  incorrectGuess: string;
  inWordGuess: string;
  noGuess: string;
};

export type ColorTheme = {
  name: string;
  colors: Colors;
};

export function updateCSSColors(colorTheme: ColorTheme = defaultTheme) {
  const root = document.documentElement;
  const { colors } = colorTheme;

  let category: keyof Colors;
  for (category in colors) {
    const cssVar = `--color-${category}`;
    root.style.setProperty(cssVar, colors[category]);
  }
}

const defaultTheme: ColorTheme = {
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
};

const createColorThemeLookup = createLookupForArrayObjectsByKey("name");

export default function useColorTheme(
  allThemes: Array<ColorTheme>
): [ColorTheme, (s: string) => void] {
  const colorThemesLookup = useMemo(
    () => createColorThemeLookup(allThemes),
    [allThemes]
  );
  const [activeColorTheme, setActiveColorTheme] = useLocalStorage(
    "lastActiveColors",
    defaultTheme
  );

  const changeActiveTheme = useCallback(
    (themeName: string) => {
      const newTheme = colorThemesLookup[themeName] ?? defaultTheme;
      setActiveColorTheme(newTheme);
      updateCSSColors(newTheme);
    },
    [colorThemesLookup]
  );

  return [activeColorTheme, changeActiveTheme];
}
