import { findManyTechnology } from "@/app/lib/@backend/action/engineer/technology.action";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

export const useTechnologySearchForm = () => {
  const [technologySearchTerm, setTechnologySearchTerm] = useState<string>("");

  const { handleParamsChange } = useHandleParamsChange();

  const technologyQuery = useQuery({
    queryKey: ["findManyTechnology", technologySearchTerm],
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (technologySearchTerm.trim() !== "") {
        filter["name.brand"] = { $regex: technologySearchTerm, $options: "i" };
      }

      return findManyTechnology(filter);
    },
  });

  const handleSearchTechnology = useCallback((input: string) => {
    setTechnologySearchTerm(input);
  }, []);

  const handleChangeTechnology = useCallback(
    (input: string) => {
      handleParamsChange({
        technology_id: input,
        configuration_profile_id: null,
      });
    },
    [handleParamsChange]
  );

  return {
    technologyQuery,
    handleChangeTechnology,
    handleSearchTechnology,
  };
};
