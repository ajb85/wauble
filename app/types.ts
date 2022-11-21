import { DataFunctionArgs } from "@remix-run/node";

export type Session = {
  has: (s: string) => boolean;
  get: (s: string) => string;
};

type SessionStorage = {
  getSession: (s: string) => Session;
  commitSession: (s: Session) => Session;
};
type RequestExtension = {
  context: { sessionStorage: SessionStorage };
  locals?: any;
};

export type RequestMeta = DataFunctionArgs & RequestExtension;

export type StringObject = { [key: string]: string };
export type BoolObject = { [key: string]: boolean };
export type AnyObject = { [key: string]: any };
