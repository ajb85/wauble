import type { RequestMeta } from "~/types";
import { getFromRequest, saveToRequest } from "~/utils.server";
import type { Next } from ".";
import * as ColorThemeQueries from "~/models/colorThemes.server";
import { saveUserToRequest } from "./isAuthed";

export async function loadUserColors(meta: RequestMeta, next: Next) {
  await saveUserToRequest(meta);
  const user = getFromRequest(meta, "user");
  const colorThemes = await ColorThemeQueries.getColorThemesForUser(user?.id);
  saveToRequest(meta, { colorThemes });
  next();
}

export async function loadUserColorsTerminal(meta: RequestMeta) {
  await loadUserColors(meta, () => {});
  return getFromRequest(meta, "colorThemes");
}
