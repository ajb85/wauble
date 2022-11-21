import { getFromLoader, returnFromLoader } from "~/utils.server";
import type { RequestMeta, StringObject, AnyObject } from "../types";

export default async function middleware(
  meta: RequestMeta,
  ...middlewares: Array<Middleware>
) {
  const results = await runMiddlewareWithContext(meta)(middlewares);
  return results || getFromLoader(meta) || {};
}

function runMiddlewareWithContext(meta: RequestMeta) {
  async function runMiddleware(
    middlewares: Array<Middleware>,
    index: number = 0
  ): Promise<MiddlewareResponse> {
    let runNext = false;
    const next = () => (runNext = true);
    const error = await middlewares[index]?.(meta, next);
    if (error === null || (error && error.status)) {
      return error;
    } else if (error !== undefined) {
      returnFromLoader(meta, error);
    } else if (runNext) {
      return runMiddleware(middlewares, index + 1);
    }
  }

  return runMiddleware;
}

export type Response = globalThis.Response;
export type ResponseOrData = Response | StringObject;
export type MiddlewareResponse =
  | ResponseOrData
  | AnyObject
  | void
  | null
  | Promise<ResponseOrData | AnyObject | void | null>;
export type Next = () => void;
export type Middleware = (
  context: RequestMeta,
  next: Next
) => MiddlewareResponse;

export { default as isAuthed } from "./isAuthed";
