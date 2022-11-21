import { redirect } from "@remix-run/server-runtime";
import { authenticateRequest, saveToRequest } from "~/utils.server";
import type { RequestMeta } from "~/types";
import type { Next } from ".";

export default function routeIfAuthed(route: string) {
  return async (meta: RequestMeta, next: Next) => {
    const user = await authenticateRequest(meta);
    if (user) {
      saveToRequest(meta, { user });
      return redirect(route);
    }

    next();
  };
}
