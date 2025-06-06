"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  IClient,
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
    client?: IClient | null;
  }

  export interface Identified {
    port: ISerialPort;
    equipment: Equipment;
    status: "fully_identified" | "partially_identified" | "not_identified";
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
  const { technology, client } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [configured, setConfigured] = useState<Namespace.Configuration[]>([]);
  const isConfiguring = useRef(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleConfiguration,
    handleGetProfile,
    requestPort,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the configuration process, check if the process was successful and save result on database
  const configure = useCallback(
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
      const configurationResult = await handleConfiguration(
        identified
          .filter((i) => i.equipment.serial && i.equipment.firmware)
          .map(({ port }) => port),
        configuration_profile
      );

      // obtain device profile after configuration process
      const profileResult = await handleGetProfile(ports);

      delete configuration_profile.config?.specific?.password;

      // check if each message sent has response and configured to the desired profile
      const result = configurationResult
        .map(({ port, response, messages, end_time, init_time, status }) => {
          if (!response || !messages || !end_time || !init_time)
            return undefined;

          const { equipment } = identified.find((el) => el.port === port) ?? {};

          if (!equipment || !technology) return undefined;

          const profileAfterConfiguration = profileResult.find(
            (el) => el.port === port
          );

          if (!profileAfterConfiguration?.config) return undefined;

          const { difference: generalDiff } = checkWithDifference(
            configuration_profile.config?.general,
            profileAfterConfiguration?.config?.general
          );

          const { difference: specificDiff } = checkWithDifference(
            configuration_profile.config?.specific,
            profileAfterConfiguration?.config?.specific
          );

          const configuration_log: Omit<
            IConfigurationLog,
            "id" | "created_at" | "user"
          > = {
            profile: {
              id: configuration_profile.id,
              name: configuration_profile.name,
              config: configuration_profile.config,
            },
            technology: {
              id: technology.id,
              system_name: technology.name.system,
            },
            equipment: {
              imei: equipment.imei!,
              firmware: equipment.firmware!,
              serial: equipment.serial!,
              iccid: equipment.iccid,
            },
            checked: false,
            status,
            metadata: {
              messages: messages.map(({ key, message }) => ({
                request: message,
                response: response[key],
              })),
              end_time,
              init_time,
            },
            not_configured: {
              general: generalDiff,
              specific: specificDiff,
            },
            raw_profile: profileAfterConfiguration.raw as [string, string][],
            parsed_profile: profileAfterConfiguration.config,
            client: client
              ? {
                  id: client.id,
                  trade_name: client.trade_name,
                  company_name: client.company_name,
                  document: client.document.value,
                }
              : null,
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
    [handleConfiguration, handleGetProfile, identified, ports, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConfiguring.current) return;
      if (!isIdentifying.current && ports.length) {
        isIdentifying.current = true;
        const identified = await handleDetection(ports);
        setIdentified(
          identified
            .filter((el) => el.response !== undefined)
            .map(({ port, response }) => ({
              port,
              equipment: response!,
              status: isIdentified(response!),
            }))
        );
        isIdentifying.current = false;
      } else if (!isIdentifying.current && !ports.length) {
        setIdentified([]);
      }
    }, 5000); // 5000 ms = 5 segundos

    // Limpeza: limpa o intervalo quando o componente é desmontado ou quando as dependências mudarem
    return () => clearInterval(interval);
  }, [ports, handleDetection]);

  return {
    configured,
    identified,
    configure,
    requestPort,
  };
};
