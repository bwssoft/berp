import { exportAutoTestLog } from "@/app/lib/@backend/action";
import { IAutoTestLog } from "@/app/lib/@backend/domain";
import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { Filter } from "mongodb";
import { ChangeEvent } from "react";

export const useAutoTestLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleQuickSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    handleParamsChange({
      query: e.target.value,
    });
  }, 200);

  const handleExport = async (filter: Filter<IAutoTestLog>) => {
    const url = await exportAutoTestLog(filter);
    window.location.href = url;
  };

  return {
    handleQuickSearch,
    handleExport,
  };
};
