import supabaseToken from "./cookie";
import { supabase } from "./db.server";
import type { RequestMeta } from "./types";
import { mergeObjects } from "./utils";

export const getToken = async ({ request }: RequestMeta) => {
  const cookieHeader = request.headers.get("Cookie");
  return await supabaseToken.parse(cookieHeader);
};

export const getUserByToken = async (token: string) => {
  supabase.auth.setAuth(token);
  const { user, error } = await supabase.auth.api.getUser(token);
  return { user, error };
};

export const authenticateRequest = async (meta: RequestMeta) => {
  const token = await getToken(meta);
  if (token) {
    const { user, error } = await getUserByToken(token);

    if (error) {
      return false;
    }

    if (user) {
      const profile = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", user.id)
        .limit(1)
        .single();

      if (profile?.data) {
        return {
          id: user.id,
          email: user.email,
          ...profile.data,
        };
      }
    }

    return false;
  }
};

export const returnFromLoader = (
  meta: RequestMeta,
  data: { [k: string]: any }
) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  if (!meta.locals.loader) {
    meta.locals.loader = {};
  }

  meta.locals.loader = mergeObjects(meta.locals.loader, data);
};

export const saveToRequest = (
  meta: RequestMeta,
  data: { [k: string]: any }
) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  meta.locals = mergeObjects(meta.locals, data);
};

export const getFromLoader = (meta: RequestMeta, key?: string) => {
  if (!meta.locals) {
    meta.locals = {};
  }

  if (!meta.locals.loader) {
    meta.locals.loader = {};
  }

  return key ? meta.locals.loader[key] : meta.locals.loader;
};
