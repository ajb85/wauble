import { redirect } from "@remix-run/server-runtime";
import type { RequestMeta } from "~/types";
import {
  authenticateRequest,
  getFromRequest,
  saveToRequest,
} from "~/utils.server";
import type { Next } from ".";

export default async function isAuthed(meta: RequestMeta, next: Next) {
  await saveUserToRequest(meta, () => {});
  const user = getFromRequest(meta, "user");
  if (!user) return redirect("/login");
  next();
}

export const saveUserToRequest = async (meta: RequestMeta) => {
  const user = await authenticateRequest(meta);
  user && saveToRequest(meta, { user });
};
