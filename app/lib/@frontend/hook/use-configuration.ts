"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Device,
  IClient,
  IConfigurationLog,
  IConfigurationProfile,
  ITechnology,
} from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { createManyConfigurationLog } from "../../@backend/action";
import { useTechnology } from "./use-technology";
import { useRouter } from "next/navigation";

namespace Namespace {
  export interface UseConfigurationProps {
    technology: ITechnology | null;
    client?: IClient | null;
    configurationProfile?: IConfigurationProfile | null;
  }

  export interface Detected {
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
  const { technology, configurationProfile } = props;

  const router = useRouter();

  const [detected, setDetected] = useState<Namespace.Detected[]>([]);
  const detectedKey = useMemo(() => {
    return detected
      .map((d) => d.equipment.serial ?? "")
      .filter((s) => s.length > 0)
      .sort()
      .join("|");
  }, [detected]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const [configured, setConfigured] = useState<Namespace.Configuration[]>([]);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);

  const [autoConfigurationEnabled, setAutoConfigurationEnabled] =
    useState<boolean>(false);

  const toggleAutoConfiguration = (checked: boolean) =>
    setAutoConfigurationEnabled(checked);

  const [redirectToCheckEnabled, setRedirectToCheckEnabled] =
    useState<boolean>(false);

  const toggleRedirectToCheck = (checked: boolean) =>
    setRedirectToCheckEnabled(checked);

  const redirectToCheck = (configurationLog: IConfigurationLog[]) => {
    router.push(
      `/production/tool/check-configuration?technology_id=${technology!.id}&${configurationLog.map(({ id }) => `configuration_log_id[]=${id}`).join("&")}&auto_checking=true`
    );
  };

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleConfiguration,
    requestPort,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the configuration process, check if the process was successful and save result on database
  const configure = async (
    detected: Namespace.Detected[],
    configuration_profile: IConfigurationProfile
  ) => {
    setIsConfiguring(true);

    try {
      const validDetected = detected.filter(
        (
          i
        ): i is (typeof detected)[number] & {
          equipment: { serial: string; firmware: string };
        } => Boolean(i.equipment.serial && i.equipment.firmware)
      );

      const configurationResult = await handleConfiguration(
        validDetected,
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

      redirectToCheckEnabled && redirectToCheck(dataSavedOnDb);
    } catch (error) {
      console.error("[ERROR] configure use-configuration", error);
    } finally {
      setIsConfiguring(false);
    }
  };

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isConfiguring) return;

      if (!isDetecting && ports.length) {
        setIsDetecting(true);
        const identified = await handleDetection(ports);

        setDetected((prev) => {
          const newOnes = identified.filter(
            (id) =>
              !prev.some((el) => el.equipment.serial === id.response?.serial)
          );

          const mappedNew = newOnes.map(({ port, response }) => ({
            port,
            equipment: response!,
            status: isIdentified(response),
          }));

          return prev.concat(mappedNew);
        });

        setIsDetecting(false);
      } else if (!isDetecting && !ports.length) {
        setDetected([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ports, handleDetection, isConfiguring, isDetecting]);

  useEffect(() => {
    (async () => {
      if (
        detectedKey.length > 0 &&
        autoConfigurationEnabled &&
        configurationProfile
      ) {
        await configure(detected, configurationProfile);
      }
    })();
  }, [detectedKey, configurationProfile, autoConfigurationEnabled]);

  return {
    configured,
    detected,
    configure,
    requestPort,
    isConfiguring,
    isDetecting,
    toggleAutoConfiguration,
    autoConfigurationEnabled,
    redirectToCheckEnabled,
    toggleRedirectToCheck,
    redirectToCheck,
  };
};
