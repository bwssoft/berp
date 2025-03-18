import { useCallback, useEffect, useRef, useState } from "react";
import {
  IConfigurationLog,
  IConfigurationProfile,
  ITechnology,
} from "../../@backend/domain";
import { toast } from "./use-toast";
import { checkWithDifference } from "../../util";
import { ISerialPort } from "./use-serial-port";
import { createManyConfigurationLog } from "../../@backend/action";
import { useTechnology } from "./use-technology";

namespace Namespace {
  export interface UseConfigurationProps {
    technology: ITechnology | null;
  }

  export interface Identified {
    port: ISerialPort;
    equipment: Equipment;
  }

  interface Equipment {
    imei?: string | undefined;
    iccid?: string | undefined;
    firmware?: string | undefined;
    serial?: string | undefined;
  }

  export interface Configuration extends IConfigurationLog {}
}

export const useConfiguration = (props: Namespace.UseConfigurationProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [configured, setConfigured] = useState<Namespace.Configuration[]>([]);
  const isConfiguring = useRef(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleIdentificationProcess,
    handleConfigurationProcess,
    handleGetProfile,
    requestPort,
  } = useTechnology(technology);

  // function that handle the configuration process, check if the process was successful and save result on database
  const handleConfiguration = useCallback(
    async (configuration_profile: IConfigurationProfile | null) => {
      if (configuration_profile === null) {
        toast({
          variant: "error",
          title: "Erro!",
          description: "Selecione um perfil de configuração",
        });
        return;
      }

      isConfiguring.current = true;

      // configure devices
      const configurationResult = await handleConfigurationProcess(
        identified
          .filter((i) => i.equipment.imei && i.equipment.firmware)
          .map(({ port }) => port),
        configuration_profile
      );

      // obtain device profile after configuration process
      const profileResult = await handleGetProfile(ports);

      delete configuration_profile.config?.password;

      // check if each message sent has response and configured to the desired profile
      const result = configurationResult
        .map(({ port, response, messages, end_time, init_time }) => {
          if (!response || !messages || !end_time || !init_time)
            return undefined;

          const { equipment } = identified.find((el) => el.port === port) ?? {};

          if (!equipment || !technology) return undefined;

          const profileAfterConfiguration = profileResult.find(
            (el) => el.port === port
          );

          const { difference } = checkWithDifference(
            configuration_profile.config,
            profileAfterConfiguration?.response
          );

          const configuration_log: Omit<
            IConfigurationLog,
            "id" | "created_at" | "user_id"
          > = {
            profile: {
              id: configuration_profile.id,
              name: configuration_profile.name,
              config: configuration_profile.config,
            },
            technology: {
              id: technology.id,
              name: technology.name.brand,
            },
            equipment: {
              imei: equipment.imei!,
              firmware: equipment.firmware!,
              serial: equipment.serial,
              iccid: equipment.iccid,
            },
            double_check: {
              has: false,
              need: true,
            },
            is_configured: Object.entries(response ?? {}).every(
              ([_, value]) => typeof value !== "undefined"
            ),
            metadata: {
              commands: messages.map(({ key, message }) => ({
                request: message,
                response: response[key],
              })),
              end_time,
              init_time,
            },
            not_configured: difference,
            raw_rofile: profileAfterConfiguration?.raw,
            processed_profile: profileAfterConfiguration?.response,
          };

          return configuration_log;
        })
        .filter((el): el is NonNullable<typeof el> => el !== undefined);

      // save result on database
      const dataSavedOnDb = await createManyConfigurationLog(result);

      // update state with configuration process result
      setConfigured((prev) => prev.concat(dataSavedOnDb));

      isConfiguring.current = false;
    },
    [identified, ports, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    (async () => {
      if (!isIdentifying.current && ports.length) {
        isIdentifying.current = true;
        const identified = await handleIdentificationProcess(ports);
        setIdentified(
          identified
            .filter((el) => el.response !== undefined)
            .map(({ port, response }) => ({ port, equipment: response! }))
        );
        isIdentifying.current = false;
      } else if (!isIdentifying.current && !ports.length) {
        setIdentified([]);
      }
    })();
  }, [ports]);

  return {
    configured,
    identified,
    handleConfiguration,
    requestPort,
  };
};
