"use client";

import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { useCallback, ChangeEvent } from "react";

export const useSearchProfileForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleChangeProfileName = useDebounce(
    useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        handleParamsChange({
          profile_name: e.target.value,
        });
      },
      [handleParamsChange]
    ),
    300
  );

  return {
    handleChangeProfileName,
  };
};
