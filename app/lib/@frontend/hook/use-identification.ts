"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IIdentificationLog, ITechnology } from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import { createOneIdentificationLog } from "../../@backend/action";
import { sleep } from "../../util";

namespace Namespace {
  export interface useIdentificationProps {
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
  } = useTechnology(technology);

  // function that handle the identification process, check if the process was successful and save result on database
  const identify = useCallback(
    async (id: string) => {
      isWriting.current = true;

      // run identification
      const { port, response, messages, end_time, init_time } =
        await handleIdentification(ports[0], id);

      // check if each message sent has response
      if (!response || !messages || !end_time || !init_time) return undefined;

      const { equipment } = identified.find((el) => el.port === port) ?? {};

      if (!equipment || !technology) return undefined;

      await sleep(5000);

      const identification = await handleGetIdentification(port);

      const log: Omit<IIdentificationLog, "id" | "created_at" | "user"> = {
        equipment: {
          imei: equipment.imei!,
          serial: equipment.serial!,
          firmware: equipment.firmware!,
          iccid: equipment.iccid,
        },
        identification: identification?.response,
        status: id === identification?.response?.serial,
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

      // save result on database
      const dataSavedOnDb = await createOneIdentificationLog(log);

      // update state with process result
      setProcess((prev) => prev.concat(dataSavedOnDb));

      isWriting.current = false;
    },
    [
      handleGetIdentification,
      handleIdentification,
      identified,
      ports,
      technology,
    ]
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
            .map(({ port, response }) => ({ port, equipment: response! }))
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
