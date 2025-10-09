import { exportIdentificationLog } from "@/backend/action/production/identification-log.action";
import {IIdentificationLog} from "@/backend/domain/production/entity/identification-log.definition";
import { useDebounce } from "@/app/lib/@frontend/hook/use-debounce";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { Filter } from "mongodb";
import { ChangeEvent } from "react";

export const useIdentificationLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleQuickSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    handleParamsChange({
      query: e.target.value,
    });
  }, 200);

  const handleExport = async (filter: Filter<IIdentificationLog>) => {
    const url = await exportIdentificationLog(filter);
    window.location.href = url;
  };
  return {
    handleQuickSearch,
    handleExport,
  };
};

