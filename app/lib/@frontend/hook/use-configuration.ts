"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Device,
  E3Plus4GConfig,
  IClient,
  IConfigurationLog,
  IConfigurationProfile,
  ITechnology,
} from "../../@backend/domain";
import { toast } from "./use-toast";
import { checkWithDifference, sleep } from "../../util";
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
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  }

  export interface Configuration extends IConfigurationLog {}
}

export const useConfiguration = (props: Namespace.UseConfigurationProps) => {
  const { technology, client } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [configured, setConfigured] = useState<Namespace.Configuration[]>([]);
  const isConfiguring = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    async (configuration_profile: IConfigurationProfile) => {
      isConfiguring.current = true;
      setIsProcessing(true);

      try {
        const validIdentified = identified.filter(
          (
            i
          ): i is (typeof identified)[number] & {
            equipment: { serial: string; firmware: string };
          } => Boolean(i.equipment.serial && i.equipment.firmware)
        );

        const configurationResult = await handleConfiguration(
          validIdentified,
          configuration_profile
        );

        // check if each message sent has response and configured to the desired profile
        const result = configurationResult
          .map(
            ({
              messages,
              status,
              equipment,
              applied_profile,
              init_time,
              end_time,
            }) => {
              const configuration_log: Omit<
                IConfigurationLog,
                "id" | "created_at" | "user"
              > = {
                equipment,
                checked: false,
                init_time,
                end_time,
                status,
                applied_profile,
                desired_profile: {
                  id: configuration_profile.id,
                  name: configuration_profile.name,
                  config: configuration_profile.config,
                },
                technology: {
                  id: technology!.id,
                  system_name: technology!.name.system,
                },
                messages,
              };

              return configuration_log;
            }
          )
          .filter((el): el is NonNullable<typeof el> => el !== undefined);

        // save result on database
        const dataSavedOnDb = await createManyConfigurationLog(result);

        // update state with configuration process result
        setConfigured((prev) => prev.concat(dataSavedOnDb));
      } catch (error) {
        console.log("error", error);
      } finally {
        isConfiguring.current = false;
        setIsProcessing(false);
      }
    },
    [handleConfiguration, handleGetProfile, identified, ports, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConfiguring.current) return;
      if (!isIdentifying.current && ports.length) {
        isIdentifying.current = true;
        setIsProcessing(true);
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
        setIsProcessing(false);
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
    isProcessing,
  };
};
