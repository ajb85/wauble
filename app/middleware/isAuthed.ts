import { redirect } from "@remix-run/server-runtime";
import type { RequestMeta } from "~/types";
import {
  authenticateRequest,
  returnFromLoader,
  saveToRequest,
} from "~/utils.server";
import type { Next } from ".";

export default async function isAuthed(meta: RequestMeta, next: Next) {
  const user = await authenticateRequest(meta);
  if (!user) return redirect("/login");
  saveToRequest(meta, { user });
  returnFromLoader(meta, { user });
  next();
}
