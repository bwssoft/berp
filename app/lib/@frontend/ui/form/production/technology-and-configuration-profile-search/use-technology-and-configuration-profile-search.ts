import {
  findManyConfigurationProfile,
  findOneConfigurationProfile,
} from "@/app/lib/@backend/action/engineer/configuration-profile.action";
import { findManyTechnology } from "@/app/lib/@backend/action/engineer/technology.action";
import {IConfigurationLog} from "@/app/lib/@backend/domain/production/entity/configuration-log.definition";
import {IConfigurationProfile} from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { useHandleParamsChange } from "@/app/lib/@frontend/hook/use-handle-params-change";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  configurationLog?: IConfigurationLog[] | null;
  configurationProfile?: IConfigurationProfile | null;
}

const schema = z.object({
  profile: z.array(z.any()),
});

type ConfigurationProfileFormData = z.infer<typeof schema>;

export const useTechnologyAndConfigurationProfileForm = ({
  configurationLog = [],
  configurationProfile,
}: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<ConfigurationProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: async () => {
      if (configurationProfile) {
        return {
          profile: [configurationProfile],
        };
      }

      if (!configurationLog || configurationLog?.length === 0) {
        return {
          profile: [],
        };
      }

      const log = configurationLog[0];

      const profileFromConfigurationLog = await queryClient.fetchQuery({
        queryKey: ["profile", log.desired_profile.id],
        queryFn: () =>
          findOneConfigurationProfile({
            id: log.desired_profile.id,
          }),
      });

      return {
        profile: profileFromConfigurationLog
          ? [profileFromConfigurationLog]
          : [],
      };
    },
  });

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
    (input: IConfigurationProfile[]) => {
      if (input.length === 1) {
        handleParamsChange({ configuration_profile_id: input[0].id });
        form.setValue("profile", input);
      }
    },
    [handleParamsChange]
  );

  return {
    form,
    configurationProfileQuery,
    technologyQuery,
    handleSearchConfigurationProfile,
    handleChangeTechnology,
    handleChangeConfigurationProfile,
  };
};
