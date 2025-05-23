"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Device, IIdentificationLog, ITechnology } from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import {
  createOneDevice,
  createOneIdentificationLog,
} from "../../@backend/action";
import { sleep } from "../../util";

namespace Namespace {
  export interface useIdentificationProps {
    technology: ITechnology | null;
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

  export interface Identification extends IIdentificationLog {}
}

export const useIdentification = (props: Namespace.useIdentificationProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [process, setProcess] = useState<Namespace.Identification[]>([]);
  const isWriting = useRef(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleDetection,
    handleIdentification,
    requestPort,
    handleGetIdentification,
    isIdentified,
  } = useTechnology(technology);

  // function that handle the identification process, check if the process was successful and save result on database
  const identify = useCallback(
    async (id: string) => {
      isWriting.current = true;

      const { equipment, port } = identified[0];

      if (!equipment || !equipment.firmware || !equipment.serial || !technology)
        return;

      // run identification
      const { response, messages, end_time, init_time } =
        await handleIdentification(port, id);

      // check if each message sent has response
      if (!response || !messages || !end_time || !init_time) return undefined;

      await sleep(2000);

      const identification = await handleGetIdentification(port);
      const status = id === identification?.response?.serial;

      const log: Omit<IIdentificationLog, "id" | "created_at" | "user"> = {
        equipment: {
          imei: equipment.imei!,
          serial: equipment.serial!,
          firmware: equipment.firmware!,
          iccid: equipment.iccid,
        },
        identification: identification?.response,
        status,
        metadata: {
          messages: messages.map(({ key, message }) => ({
            request: message,
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
          createOneDevice({
            equipment: {
              firmware: equipment.firmware!,
              serial: identification?.response?.serial!,
              imei: identification?.response?.imei,
            },
            simcard: { iccid: equipment.iccid },
            model:
              Device.Model[technology.name.system as keyof typeof Device.Model],
            identified_at: new Date(),
          })
        );
      }

      // save result on database
      const [dataSavedOnDb] = await Promise.all(promises);

      // update state with process result
      setProcess((prev) => prev.concat(dataSavedOnDb));

      isWriting.current = false;
    },
    [handleGetIdentification, handleIdentification, identified, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
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
    }, 5000); // 5000 ms = 5 segundos

    // Limpeza: limpa o intervalo quando o componente é desmontado ou quando as dependências mudarem
    return () => clearInterval(interval);
  }, [ports, handleDetection]);

  return {
    process,
    identified,
    identify,
    requestPort,
  };
};
