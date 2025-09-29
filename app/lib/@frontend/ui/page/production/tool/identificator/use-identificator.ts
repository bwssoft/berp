"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Device,
  IIdentificationLog,
  ITechnology,
} from "../../../../../../@backend/domain";
import { ISerialPort } from "../../../../../hook/use-serial-port";
import { useTechnology } from "../../../../../hook/use-technology";

import { toast } from "../../../../../hook/use-toast";
import { createOneIdentificationLog } from "../../../../../../@backend/action/production/identification-log.action";
import { upsertOneDevice } from "../../../../../../@backend/action/engineer/device.action";

namespace Namespace {
  export interface useIdentificationProps {
    technology: ITechnology | null;
  }

  export interface Detected {
    port: ISerialPort;
    equipment?: Equipment | undefined;
    status: "fully_identified" | "partially_identified" | "not_identified";
  }

  export interface CurrentEquipment extends Omit<Equipment, "firmware" | "serial"> {
    serial: string;
    firmware: string;
  }

  export interface CurrentDetected extends Omit<Detected, "equipment"> {
    equipment: CurrentEquipment
  }

  interface Equipment {
    firmware?: string;
    serial?: string;
    imei?: string | undefined;
    iccid?: string | undefined;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  }

  export interface Identification extends IIdentificationLog {}

  export interface IdentificationResult {
    ok: true;
    port: ISerialPort;
    messages: any[];
    init_time: number;
    end_time: number;
    status: boolean;
    equipment_before: {
      serial: string;
      imei?: string;
      lora_keys: Device.Equipment["lora_keys"];
    };
    equipment_after: {
      serial: string;
      imei?: string;
      lora_keys: Device.Equipment["lora_keys"];
    };
  }
}

export const useIdentification = (props: Namespace.useIdentificationProps) => {
  const { technology } = props;
  const [detected, setDetected] = useState<Namespace.Detected[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const [identified, setIdentified] = useState<Namespace.Identification[]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleIdentification,
    requestPort,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the identification process, check if the process was successful and save result on database
  const identify = async (
    id: string,
    detected: Namespace.Detected[],
    technology: ITechnology
  ) => {
    try {
      setIsIdentifying(true);
      const [current] = detected;

      if (
        !current.equipment ||
        !current.equipment.firmware ||
        !current.equipment.serial ||
        !technology
      ) {
        toast({
          variant: "error",
          description: "Nenhum equipamento está apto para ser identificado.",
          title: "Erro",
        });
        return;
      }

      // run the process
      const result = (await handleIdentification(
        current as Namespace.CurrentDetected,
        id
      )) as Namespace.IdentificationResult;

      const log: Omit<IIdentificationLog, "id" | "created_at" | "user"> = {
        equipment_before: result.equipment_before,
        equipment_after: result.equipment_after,
        messages: result.messages,
        status: result.status,
        end_time: result.end_time,
        init_time: result.init_time,
        technology: {
          id: technology.id,
          system_name: technology.name.system,
        },
      };

      // save result on database
      const promises: Promise<any>[] = [
        fetch("/api/production/identification-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        }),
      ];
      if (result.status) {
        promises.push(
          upsertOneDevice(
            {
              "equipment.serial": result.equipment_after.serial,
            },
            {
              equipment: {
                ...current.equipment as Namespace.CurrentEquipment,
                ...result.equipment_after,
              },
              simcard: current.equipment?.iccid
                ? { iccid: current.equipment?.iccid }
                : undefined,
              model:
                Device.Model[
                  technology.name.system as keyof typeof Device.Model
                ],
              identified_at: new Date(),
            }
          )
        );
      }

      // save result on database
      const [res] = await Promise.all(promises);
      if (!res.ok) throw new Error("Erro ao salvar log de identificação");
      const dataSavedOnDb = await res.json();

      // update react state with the result
      setIdentified((prev) => prev.concat(dataSavedOnDb));
    } catch (e) {
      toast({
        variant: "error",
        title: "error",
        description:
          "Ocorreu algum erro durante a o processo de identificação.",
      });
    } finally {
      // indicate that the process end
      setIsIdentifying(false);
    }
  };

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isIdentifying) return;

      if (!isDetecting && ports.length) {
        setIsDetecting(true);
        const detected = (await handleDetection(ports)).filter((d) => d.response && d.response.serial);

        setDetected(() => {
          const map = new Map();

          for (const { port, response } of detected) {
            map.set(response!.serial, {
              port,
              equipment: response,
              status: !response ? "not_identified" : isIdentified(response),
            });
          }

          return Array.from(new Set(map.values()))
        });

        setIsDetecting(false);
      } else if (!isDetecting && !ports.length) {
        setDetected([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ports, handleDetection, isIdentifying, isDetecting]);


  return {
    detected,
    identified,
    identify,
    requestPort,
    isIdentifying,
    isDetecting,
  };
};
