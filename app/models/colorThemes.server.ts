import { supabase } from "~/db.server";

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

export const colorKeys: Array<keyof Colors> = [
  "background",
  "text",
  "errors",
  "correctGuessBackground",
  "incorrectGuessBackground",
  "inWordGuessBackground",
  "noGuessBackground",
  "correctGuessText",
  "noGuessText",
  "incorrectGuessText",
  "inWordGuessText",
  "submitButtonBackground",
  "cancelButtonBackground",
  "deleteButtonBackground",
  "submitButtonText",
  "cancelButtonText",
  "deleteButtonText",
  "submitButtonBorder",
  "deleteButtonBorder",
  "cancelButtonBorder",
];

export const getNewColor = (): Colors => {
  // @ts-ignore - Typescript sucks at seeing an object being built and gets mad not all properties are there immediately
  return colorKeys.reduce((acc: Colors, cur) => {
    acc[cur] = "0 0 0";
    return acc;
  }, {});
};

export interface ColorThemeBase {
  name: string;
  colors: Colors;
  preset?: boolean;
}

export interface ColorTheme extends ColorThemeBase {
  id: string;
}

const table = "ColorThemes";
const selectProperties = "id, name, colors";
export async function getPresetColorThemes(): Promise<Array<ColorTheme>> {
  const res = await supabase
    .from(table)
    .select(selectProperties)
    .is("user_id", null);

  return res.data?.map((c) => ({ ...c, preset: true })) || [];
}

export async function getColorThemesForUser(
  user_id?: string
): Promise<Array<ColorTheme>> {
  const presetColorThemes = await getPresetColorThemes();

  if (!user_id) {
    return presetColorThemes;
  }

  const { data: userColorThemes } = await supabase
    .from(table)
    .select(selectProperties)
    .eq("user_id", user_id);

  return [...presetColorThemes, ...(userColorThemes ?? [])];
}

export async function upsertUsersColorTheme(
  colorTheme: ColorThemeBase | ColorTheme,
  user_id: string
) {
  const { data } = await supabase
    .from(table)
    .upsert({ ...colorTheme, user_id })
    .select(selectProperties)
    .limit(1)
    .single();
  return data;
}

export async function getPresetColorThemeByName(
  name: string
): Promise<ColorTheme | null> {
  // const { data: userTheme } = await supabase
  //   .from(table)
  //   .select(selectProperties)
  //   .eq("user_id", user_id)
  //   .eq("name", name)
  //   .limit(1)
  //   .single();

  // if (userTheme) {
  //   return userTheme;
  // }

  const { data: presetTheme } = await supabase
    .from(table)
    .select(selectProperties)
    .eq("user_id", null)
    .eq("name", name)
    .limit(1)
    .single();

  if (presetTheme) {
    return { ...presetTheme, preset: true };
  }

  return null;
}
