"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Device, IIdentificationLog, ITechnology } from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import {
  upsertOneDevice,
  createOneIdentificationLog,
} from "../../@backend/action";
import { toast } from "./use-toast";

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
    imei?: string | undefined;
    iccid?: string | undefined;
    firmware?: string | undefined;
    serial?: string | undefined;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  }

  export interface Identification extends IIdentificationLog {}

  export interface IdentificationError {
    ok: false;
    port: ISerialPort;
    error: string;
  }

  export interface IdentificationSuccess {
    ok: true;
    port: ISerialPort;
    response: Record<string, any>;
    messages: any[];
    init_time: number;
    end_time: number;
    status: boolean;
    equipment: {
      serial: string;
      imei?: string;
      lora_keys?: Device.Equipment["lora_keys"];
    };
  }

  export type IdentificationResult =
    | IdentificationError
    | IdentificationSuccess;
}

export const useIdentification = (props: Namespace.useIdentificationProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Detected[]>([]);
  const isIdentifying = useRef(false);

  const [process, setProcess] = useState<Namespace.Identification[]>([]);
  const isWriting = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleIdentification,
    requestPort,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the identification process, check if the process was successful and save result on database
  const identify = useCallback(
    async (id: string) => {
      setIsProcessing(true);
      isWriting.current = true;

      const [current] = identified;

      if (
        !current.equipment ||
        !current.equipment.firmware ||
        !current.equipment.serial ||
        !technology
      )
        return;

      // run identification
      const identification = (await handleIdentification(
        current.port,
        id
      )) as Namespace.IdentificationResult;

      // check if each message sent has response
      if (!identification.ok) {
        toast({
          title: "Erro ao identificar dispositivo",
          variant: "error",
          description: identification.error,
        });
        isWriting.current = false;
        setIsProcessing(false);
        return undefined;
      }

      const { response, messages, end_time, init_time, status, equipment } =
        identification;

      const log: Omit<IIdentificationLog, "id" | "created_at" | "user"> = {
        equipment: {
          serial: current.equipment.serial!,
          firmware: current.equipment.firmware!,
          imei: current.equipment?.imei,
          lora_keys: current.equipment?.lora_keys,
          iccid: current.equipment?.iccid,
        },
        identification: {
          serial: equipment.serial,
          imei: equipment?.imei,
          lora_keys: equipment?.lora_keys,
        },
        status,
        metadata: {
          messages: messages.map(({ key, command }) => ({
            request: command,
            response: response[key as keyof typeof response],
          })),
          end_time,
          init_time,
        },
        technology: {
          id: technology.id,
          system_name: technology.name.system,
        },
      };

      const promises: Promise<any>[] = [createOneIdentificationLog(log)];
      if (status) {
        promises.push(
          upsertOneDevice(
            {
              "equipment.serial": equipment.serial,
            },
            {
              equipment: {
                ...equipment,
                firmware: current.equipment.firmware,
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
      const [dataSavedOnDb] = await Promise.all(promises);

      // update state with process result
      setProcess((prev) => prev.concat(dataSavedOnDb));

      isWriting.current = false;
      setIsProcessing(false);
    },
    [handleIdentification, identified, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      setIsProcessing(true);
      if (isWriting.current) return;
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
      setIsProcessing(false);
    }, 5000); // 5000 ms = 5 segundos

    // Limpeza: limpa o intervalo quando o componente é desmontado ou quando as dependências mudarem
    return () => clearInterval(interval);
  }, [ports, handleDetection]);

  return {
    process,
    identified,
    identify,
    requestPort,
    isProcessing,
  };
};
