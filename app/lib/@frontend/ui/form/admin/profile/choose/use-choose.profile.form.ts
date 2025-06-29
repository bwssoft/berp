import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";

export const useChooseProfileForm = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { handleParamsChange } = useHandleParamsChange();

  const query = useQuery({
    queryKey: ["findManyProfile", searchTerm],
    queryFn: async () => {
      const filter: Record<string, any> = {
        active: true,
      };

      if (searchTerm.trim() !== "") {
        filter["name"] = { $regex: searchTerm, $options: "i" };
      }

      const { docs } = await findManyProfile(filter);
      return docs;
    },
  });

  const handleSearchProfile = useCallback((input: string) => {
    setSearchTerm(input);
  }, []);

  const handleChangeProfile = useCallback(
    (input: string) => {
      handleParamsChange({
        profile_id: input,
      });
    },
    [handleParamsChange]
  );

  return {
    query,
    handleChangeProfile,
    handleSearchProfile,
  };
};
