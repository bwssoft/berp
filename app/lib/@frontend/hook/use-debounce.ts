"use client";

import { useCallback, useRef } from "react";

function useDebounce<F extends (...args: any[]) => any>(
  fn: F,
  delay: number,
  external_dependencies?: any[]
) {
  const fnRef = useRef<F>(fn);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  fnRef.current = fn;

  const debouncedFn = useCallback(
    (...args: Parameters<F>) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay, external_dependencies]
  );

  return debouncedFn;
}

export { useDebounce };
