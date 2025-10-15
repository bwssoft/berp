import { Device } from "@/backend/domain/engineer/entity/device.definition";
import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../upsert/use-configuration-profile.upsert.form";

export function useGeneralConfigurationProfileForm() {
  const form = useFormContext<ConfigurationProfileSchema>();

  const handleChangeServerOption = (
    input: "ip" | "dns",
    technology: ITechnology
  ) => {
    switch (technology?.name.system) {
      case Device.Model.DM_BWS_NB2:
        if (input === "dns") {
          form.setValue("config.general.ip_primary.ip", "0.0.0.0");
          form.setValue("config.general.ip_primary.port", 0);
          form.setValue("config.general.ip_secondary.ip", "0.0.0.0");
          form.setValue("config.general.ip_secondary.port", 0);
        }
        break;

      default:
        if (input === "dns") {
          form.unregister("config.general.ip_primary.ip");
          form.unregister("config.general.ip_primary.port");
          form.unregister("config.general.ip_secondary.ip");
          form.unregister("config.general.ip_secondary.port");
        } else if (input === "ip") {
          form.unregister("config.general.dns_primary.address");
          form.unregister("config.general.dns_primary.port");
          form.unregister("config.general.dns_secondary.address");
          form.unregister("config.general.dns_secondary.port");
        }
        break;
    }
  };

  return {
    form,
    handleChangeServerOption,
  };
}

