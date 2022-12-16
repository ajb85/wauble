import type { RequestMeta, StringObject, AnyObject } from "../types";

export default async function middleware(
  meta: RequestMeta,
  ...middlewares: Array<Middleware>
) {
  const results = await runMiddlewares(middlewares, meta);
  return results;
}

async function runMiddlewares(
  middlewares: Array<Middleware>,
  meta: RequestMeta
) {
  let runNext = false;
  const next: Next = () => (runNext = true);
  const runMiddlewaresIndex = (currentIndex: number) => {
    runNext = false;
    return middlewares[currentIndex]?.(meta, next);
  };

  for (let i = 0; i < middlewares.length; i++) {
    const results = await runMiddlewaresIndex(i);
    if (results !== undefined || runNext === false) {
      return results ?? null;
    }
  }

  return null;
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
