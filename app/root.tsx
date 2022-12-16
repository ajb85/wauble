import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { bodyClickListener } from "./utils";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import globalStyles from "./styles/global.css";
import useColorThemes, { updateCSSColors } from "./hooks/useColorThemes";
import type { RequestMeta } from "./types";
import middleware from "./middleware";
import { loadUserColorsTerminal } from "./middleware/loadUserColors";
import type { ColorTheme } from "./models/colorThemes.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: globalStyles },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Bungee+Outline&family=Roboto&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Wauble",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = (meta: RequestMeta) =>
  middleware(meta, loadUserColorsTerminal);

export default function App() {
  const colorThemes: Array<ColorTheme> = useLoaderData();
  useColorThemes(colorThemes);
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body
        onClick={bodyClickListener}
        className="h-full bg-background font-sans text-text"
      >
        <Outlet />
        <ScrollRestoration />
        <script src="./TW-ELEMENTS-PATH/dist/js/index.min.js"></script>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
