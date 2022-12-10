import { AnyObject } from "./types";

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function isObject(obj: any) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function mergeObjects(obj1: any, obj2: any) {
  if (isObject(obj1) && isObject(obj2)) {
    const keyRecord: { [key: string]: any } = {};
    const merged: AnyObject = {};
    for (let key in obj1) {
      keyRecord[key] = true;
      merged[key] = mergeObjects(obj1[key], obj2[key]);
    }

    for (let key in obj2) {
      if (!keyRecord[key]) {
        merged[key] = obj2[key];
      }
    }

    return merged;
  }

  if (obj2 === undefined) {
    return obj1;
  }

  if (obj1 === undefined) {
    return obj2;
  }

  return obj2;
}

function combineTwoClasses(
  class1: string,
  class2?: string | false | undefined
) {
  if (!class2) {
    return class1;
  }

  const space = class1.length ? " " : "";
  return `${class1}${space}${class2 || ""}`;
}

export const combineClasses = (
  ...classes: Array<string | false | undefined>
) => {
  return classes.reduce((acc: string, c) => combineTwoClasses(acc, c), "");
};

export function getFromDataFromObject(
  obj: AnyObject,
  existingFormToAppend?: HTMLFormElement
) {
  const formData = new FormData(existingFormToAppend);
  for (let key in obj) {
    formData.set(key, JSON.stringify(obj[key]));
  }

  return formData;
}

export const bgColorsByType = {
  correct: "bg-correctGuessBackground text-correctGuessText", //"bg-lime-300",
  inWord: "bg-inWordGuessBackground text-inWordGuessText", //"bg-yellow-300",
  wrong: "bg-incorrectGuessBackground text-incorrectGuessText", //"bg-zinc-500",
  notGuessed: "bg-noGuessBackground text-noGuessText", //"shadow-slate-300"
};

export const bgHoverColorsByType = {
  correct: "hover:bg-lime-100",
  inWord: "hover:bg-yellow-100",
  wrong: "hover:bg-zinc-300",
  notGuessed: "hover:bg-slate-100",
};

const defaultRGB = [0, 0, 0];
export function parseRGBString(value?: string) {
  return value?.split(" ").map((val) => Number(val)) ?? defaultRGB;
}

export function hexToRGB(h: string) {
  let r: number | string = 0,
    g: number | string = 0,
    b: number | string = 0;

  if (h.length === 4) {
    // 3 digits
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length === 7) {
    // 6 digits
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return +r + " " + +g + " " + +b;
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(rgb: string) {
  const [r, g, b] = parseRGBString(rgb);
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function createLookupForArrayObjectsByKey(key: string) {
  return (arr: Array<AnyObject>) =>
    arr.reduce((acc, cur) => {
      if (cur[key]) {
        acc[cur[key]] = cur;
      }

      return acc;
    }, {});
}

export function stopProp(e: React.MouseEvent) {
  return e.stopPropagation();
}

export type BodyClickListener = (e: React.MouseEvent) => void;
export type UnsubBodyClickListener = () => boolean;
const subscriptions: Map<BodyClickListener, true> = new Map();
export function addBodyClickListener(callback: BodyClickListener) {
  subscriptions.set(callback, true);
  const unsub: UnsubBodyClickListener = () => subscriptions.delete(callback);
  return unsub;
}

export function bodyClickListener(e: React.MouseEvent) {
  subscriptions.forEach((_, listener) => {
    listener(e);
  });
}

export function toDisplayCase(s: string) {
  let capNext = false;
  return s.split("").reduce((str, char, i) => {
    if (char === " ") {
      capNext = true;
      str += char;
    } else if (capNext || i === 0) {
      str += char.toUpperCase();
      capNext = false;
    } else if (char.toUpperCase() === char) {
      if (str[str.length - 1] !== " ") {
        str += " ";
      }
      str += char;
    } else {
      str += char;
    }
    return str;
  }, "");
}

export function isNumber(num: any) {
  return !isNaN(Number(num));
}

export type DebounceConfig = {
  delay?: number;
};

type DebounceCallback = (...args: Array<any>) => any;
export function leadingDebounce(cb: DebounceCallback, config: DebounceConfig) {
  const { delay } = config;
  const timeoutDelay = isNumber(delay) ? delay : 250;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const resetDebounce = () => {
    timeout = null;
  };

  return (...args: Array<any>) => {
    let didRun = false;
    let value: any;
    if (!timeout) {
      didRun = true;
      value = cb(...args);
    } else {
      didRun = false;
      clearTimeout(timeout);
    }

    timeout = setTimeout(resetDebounce, timeoutDelay);
    return value;
  };
}

export function trailingDebounce(cb: DebounceCallback, config: DebounceConfig) {
  const { delay } = config;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const resolves = [];
  const timeoutDelay = isNumber(delay) ? delay : 250;

  return (...args: Array<any>) => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
      timeout = null;
    }, timeoutDelay);
  };
}
