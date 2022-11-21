import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  return null;
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
