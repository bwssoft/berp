import { exportConfigurationLog } from "@/app/lib/@backend/action";
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
    const filePath = await exportConfigurationLog(filter);
    const downloadUrl = `/api/export-by-filepath/${encodeURIComponent(filePath)}`;
    window.location.href = downloadUrl;
  };
  return {
    handleQuickSearch,
    handleExport,
  };
};
