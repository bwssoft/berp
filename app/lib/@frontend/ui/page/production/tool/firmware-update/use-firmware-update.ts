"use client";

import { useEffect, useState } from "react";
import { Device } from "@/backend/domain/engineer/entity/device.definition";
import { IFirmwareUpdateLog } from "@/backend/domain/production/entity/firmware-update-log.definition";
import { ITechnology } from "@/backend/domain/engineer/entity/technology.definition";
import { ISerialPort } from "../../../../../hook/use-serial-port";
import { useTechnology } from "../../../../../hook/use-technology";
import { createManyFirmwareUpdateLog } from "@/backend/action/production/firmware-update-log.action";

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

  const [toDetect, setToDetect] = useState<boolean>(true);
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
      const res = await fetch("/api/production/firmware-update-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Erro ao salvar log de firmware");
      const dataSavedOnDb = await res.json();

      // update state with configuration process result
      setUpdated((prev) => prev.concat(dataSavedOnDb));
    } catch (error) {
      console.error("[ERROR] update use-firmware-update", error);
    } finally {
      setToDetect(false);
      setIsUpdating(false);
    }
  };

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!toDetect) return;

      if (isUpdating) return;

      if (!isDetecting && ports.length) {
        setIsDetecting(true);
        const detected = await handleDetection(ports);

        setDetected((prev) => {
          const map = new Map(prev.map((d) => [d.port, d]));

          for (const { port, response } of detected) {
            map.set(port, {
              port,
              equipment: response!,
              status: isIdentified(response!),
            });
          }

          return Array.from(map.values());
        });

        setIsDetecting(false);
      } else if (!isDetecting && !ports.length) {
        setDetected([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ports, handleDetection, isUpdating, isDetecting, toDetect]);

  return {
    updated,
    detected,
    update,
    requestPort,
    isUpdating,
    isDetecting,
    toDetect,
    setToDetect,
  };
};

