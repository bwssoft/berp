import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { ChangeEvent } from "react";

export const useConfiguratonLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleQuickSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    handleParamsChange({
      query: e.target.value,
    });
  }, 200);

  return {
    handleQuickSearch,
  };
};
