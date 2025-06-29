import { exportConfigurationLog } from "@/app/lib/@backend/action/production/configuration-log.action";
import { IConfigurationLog } from "@/app/lib/@backend/domain";
import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { Filter } from "mongodb";
import { ChangeEvent } from "react";

export const useConfigurationLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleQuickSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    handleParamsChange({
      query: e.target.value,
    });
  }, 200);

  const handleExport = async (filter: Filter<IConfigurationLog>) => {
    const url = await exportConfigurationLog(filter);
    window.location.href = url;
  };

  return {
    handleQuickSearch,
    handleExport,
  };
};
