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
    equipment: Equipment;
    status: "fully_identified" | "partially_identified" | "not_identified";
  }

  interface Equipment {
    firmware: string;
    serial: string;
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
        current,
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
                ...current.equipment,
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
      setIsDetecting(true);
      if (isIdentifying) return;
      if (!isIdentifying && ports.length) {
        setIsIdentifying(true);
        const identified = await handleDetection(ports);
        setDetected(
          identified
            .filter((el) => el.response !== undefined)
            .filter(
              (el) =>
                typeof el.response.serial === "string" &&
                typeof el.response.firmware === "string"
            )
            .map(({ port, response }) => ({
              port,
              equipment: {
                ...response!,
                serial: response!.serial as string,
                firmware: response!.firmware as string,
              },
              status: isIdentified({
                ...response!,
                serial: response!.serial as string,
                firmware: response!.firmware as string,
              }),
            }))
        );
        setIsIdentifying(false);
      } else if (!isIdentifying && !ports.length) {
        setDetected([]);
      }
      setIsDetecting(false);
    }, 3000); // 3000 ms = 3 segundos

    // Limpeza: limpa o intervalo quando o componente é desmontado ou quando as dependências mudarem
    return () => clearInterval(interval);
  }, [ports, handleDetection, isIdentifying, isIdentified]);

  return {
    detected,
    identified,
    identify,
    requestPort,
    isIdentifying,
    isDetecting,
  };
};
