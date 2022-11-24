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
  correct: "bg-lime-300",
  inWord: "bg-yellow-300",
  wrong: "bg-zinc-500",
  notGuessed: "shadow-slate-300",
};

export const bgHoverColorsByType = {
  correct: "hover:bg-lime-100",
  inWord: "hover:bg-yellow-100",
  wrong: "hover:bg-zinc-300",
  notGuessed: "hover:bg-slate-100",
};
