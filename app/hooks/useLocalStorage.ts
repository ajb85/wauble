import { useState, useEffect, useCallback } from "react";

export default function useLocalStorage(key: string, defaultValue: any = null) {
  const [storage, setStorage] = useState<any>(defaultValue);

  useEffect(() => {
    const data = localStorage.getItem(key);
    if (data !== null) {
      try {
        const parsed = JSON.parse(data);
        setStorage(parsed);
      } catch (err) {
        setStorage(data);
      }
    }
  }, [key]);

  const updateStorage = useCallback(
    (v: any) => {
      const stringified = JSON.stringify(v);
      setStorage(v);
      localStorage.setItem(key, stringified);
    },
    [key]
  );

  return [storage, updateStorage];
}
