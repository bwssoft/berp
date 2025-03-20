import { useState, useEffect, useRef } from "react";

export function useCountdown(initialValue: number, isActive: boolean) {
  const [count, setCount] = useState(initialValue);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && count > 0) {
      timerRef.current = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, count]);

  const reset = () => setCount(initialValue);

  return { count, reset };
}
