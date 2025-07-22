"use client";

import { useEffect, useState } from "react";
import {
  Device,
  IFirmwareUpdateLog,
  ITechnology,
} from "../../../../../../@backend/domain";
import { ISerialPort } from "../../../../../hook/use-serial-port";
import { useTechnology } from "../../../../../hook/use-technology";
import { createManyFirmwareUpdateLog } from "@/app/lib/@backend/action/production/firmware-update-log.action";

namespace Namespace {
  export interface UseFirmwareUpdateProps {
    technology: ITechnology | null;
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

  export interface FirmwareUpdate extends IFirmwareUpdateLog {}
}

export const useFirmwareUpdate = (props: Namespace.UseFirmwareUpdateProps) => {
  const { technology } = props;

  const [detected, setDetected] = useState<Namespace.Detected[]>([]);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const [updated, setUpdated] = useState<Namespace.FirmwareUpdate[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleFirmwareUpdate,
    requestPort,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the configuration process, check if the process was successful and save result on database
  const update = async (detected: Namespace.Detected[]) => {
    setIsUpdating(true);

    try {
      const validDetected = detected.filter(
        (
          i
        ): i is (typeof detected)[number] & {
          equipment: { serial: string; firmware: string };
        } => Boolean(i.equipment.serial && i.equipment.firmware)
      );

      const firmwareUpdateResult = await handleFirmwareUpdate(validDetected);

      // check if each message sent has response and recorded to the desired profile
      const result = firmwareUpdateResult
        .map(({ messages, status, equipment, init_time, end_time }) => {
          const configuration_log: Omit<
            IFirmwareUpdateLog,
            "id" | "created_at" | "user"
          > = {
            equipment,
            init_time,
            end_time,
            status,
            technology: {
              id: technology!.id,
              system_name: technology!.name.system,
            },
            messages,
          };

          return configuration_log;
        })
        .filter((el): el is NonNullable<typeof el> => el !== undefined);

      // save result on database
      const dataSavedOnDb = await createManyFirmwareUpdateLog(result);

      // update state with configuration process result
      setUpdated((prev) => prev.concat(dataSavedOnDb));
    } catch (error) {
      console.error("[ERROR] configure use-configuration", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isUpdating) return;

      if (!isDetecting && ports.length) {
        setIsDetecting(true);
        const detected = await handleDetection(ports);

        setDetected((prev) => {
          const newOnes = detected.filter(
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
  }, [ports, handleDetection, isUpdating, isDetecting]);

  return {
    updated,
    detected,
    update,
    requestPort,
    isUpdating,
    isDetecting,
  };
};
