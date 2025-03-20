import {
  findManyConfigurationProfile,
  findManyTechnology,
} from "@/app/lib/@backend/action";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

export const useTechnologyAndConfigurationProfileForm = () => {
  const [configurationProfileSearchTerm, setConfigurationProfileSearchTerm] =
    useState<string>("");
  const [technologySearchTerm, setTechnologySearchTerm] = useState<string>("");

  const { handleParamsChange } = useHandleParamsChange();

  const configurationProfileQuery = useQuery({
    queryKey: [
      "findManyConfigurationProfile",
      configurationProfileSearchTerm,
      technologySearchTerm,
    ],
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (configurationProfileSearchTerm.trim() !== "") {
        filter.name = { $regex: configurationProfileSearchTerm, $options: "i" };
      }
      if (technologySearchTerm.trim() !== "") {
        filter.technology_id = technologySearchTerm;
      }

      return findManyConfigurationProfile(filter);
    },
  });

  const technologyQuery = useQuery({
    queryKey: ["findManyTechnology"],
    queryFn: () => findManyTechnology({}),
  });

  const handleSearchConfigurationProfile = useCallback((input: string) => {
    setConfigurationProfileSearchTerm(input);
  }, []);

  const handleChangeTechnology = useCallback(
    (input: string) => {
      setTechnologySearchTerm(input);
      handleParamsChange({
        technology_id: input,
        configuration_profile_id: null,
      });
    },
    [handleParamsChange]
  );

  const handleChangeConfigurationProfile = useCallback(
    (input: string) => {
      handleParamsChange({ configuration_profile_id: input });
    },
    [handleParamsChange]
  );

  return {
    configurationProfileQuery,
    technologyQuery,
    handleSearchConfigurationProfile,
    handleChangeTechnology,
    handleChangeConfigurationProfile,
  };
};
