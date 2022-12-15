import { supabase } from "~/db.server";

const table = "ColorThemes";
const selectProperties = "id, name, colors";

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

export interface ColorThemeBase {
  name: string,
  colors: Colors,
  preset?:boolean;
}

export interface ColorTheme extends ColorThemeBase {
  id:string,
}

export async function getPresetColorThemes():Promise<Array<ColorTheme>> {
  const {data: colors} = await supabase.from(table).select(selectProperties).eq("user_id",null);
  return colors?.map(c => ({...c, preset:true})) || [];
}

export async function getColorThemesForUser(user_id: string): Promise<Array<ColorTheme>> {
  const presetColorThemes = await getPresetColorThemes();
  const { data: userColorThemes } = await supabase
    .from(table)
    .select(selectProperties)
    .eq("user_id", user_id)

  return [...presetColorThemes, ...(userColorThemes ?? [])];
}

export async function upsertUsersColorTheme(colorTheme:ColorThemeBase | ColorTheme, user_id:string) {
  const {data} = await supabase.from(table).upsert({...colorTheme, user_id });
  return data;
}