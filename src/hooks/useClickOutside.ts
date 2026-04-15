"use client";

import { useEffect, RefObject } from "react";

type UseClickOutsideProps<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  handler: () => void;
  enabled?: boolean;
};

const useClickOutside = <T extends HTMLElement>({
  ref,
  handler,
  enabled = true,
}: UseClickOutsideProps<T>) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler, enabled]);
};

export default useClickOutside;
