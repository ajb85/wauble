import { useRef, useEffect } from "react";
import { addBodyClickListener, stopProp } from "~/utils";
import type { BodyClickListener, UnsubBodyClickListener } from "~/utils";

export default function useBodyClick(callback: BodyClickListener) {
  const unsub = useRef<UnsubBodyClickListener | null>(null);

  useEffect(() => {
    unsub.current?.();
    unsub.current = addBodyClickListener(callback);
    return () => {
      unsub.current?.();
    };
  }, [callback]);

  return stopProp;
}