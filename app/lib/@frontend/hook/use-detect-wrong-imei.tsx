"use client";

import { useEffect, useState } from "react";

interface Props {
  state: any;
  check: (el: any) => boolean;
}

export const useWrongImeiDetector = (props: Props) => {
  const { state, check } = props;
  const [wrongImeiDetected, setWrongImeiDetected] = useState<boolean>(false);

  useEffect(() => {
    setWrongImeiDetected(state.some(check));
  }, [check, state]);

  return {
    wrongImeiDetected,
    setWrongImeiDetected,
  };
};
