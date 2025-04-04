import { useDebounce, useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { ChangeEvent } from "react";

export const useIdentificationLogSearchForm = () => {
  const { handleParamsChange } = useHandleParamsChange();

  const handleQuickSearch = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    handleParamsChange({
      equipment_imei: e.target.value,
      equipment_serial: e.target.value,
      user_name: e.target.value,
      technology_name: e.target.value,
    });
  }, 200);

  return {
    handleQuickSearch,
  };
};
