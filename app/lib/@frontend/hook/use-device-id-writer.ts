import { useCallback, useEffect, useRef, useState } from "react";
import {
  IAutoTestLog,
  IDeviceIdentificationLog,
  ITechnology,
} from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import { createOneDeviceIdentificationLog } from "../../@backend/action";
import { sleep } from "../../util";

namespace Namespace {
  export interface useDeviceIdWriterProps {
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

  export interface DeviceIdentification extends IDeviceIdentificationLog {}
}

export const useDeviceIdWriter = (props: Namespace.useDeviceIdWriterProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [process, setProcess] = useState<Namespace.DeviceIdentification[]>([]);
  const isWriting = useRef(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleIdentificationProcess,
    handleDeviceIdentificationProcess,
    requestPort,
    handleGetIdentification,
  } = useTechnology(technology);

  // function that handle the identification process, check if the process was successful and save result on database
  const handleDeviceIdentification = useCallback(
    async (id: string) => {
      isWriting.current = true;

      // run identification
      const { port, response, messages, end_time, init_time } =
        await handleDeviceIdentificationProcess(ports[0], id);

      // check if each message sent has response
      if (!response || !messages || !end_time || !init_time) return undefined;

      const { equipment } = identified.find((el) => el.port === port) ?? {};

      if (!equipment || !technology) return undefined;

      await sleep(1000);

      const deviceIdentification = await handleGetIdentification(port);

      const log: Omit<
        IDeviceIdentificationLog,
        "id" | "created_at" | "user_id"
      > = {
        equipment: {
          imei: equipment.imei!,
          firmware: equipment.firmware!,
          serial: equipment.serial,
          iccid: equipment.iccid,
        },
        current_id: deviceIdentification.response,
        is_successful: id === deviceIdentification.response,
        metadata: {
          commands: messages.map(({ key, message }) => ({
            request: message,
            response: response[key as keyof typeof response],
          })),
          end_time,
          init_time,
        },
        technology: {
          id: technology.id,
          name: technology.name.brand,
        },
      };

      // save result on database
      const dataSavedOnDb = await createOneDeviceIdentificationLog(log);

      // update state with process result
      setProcess((prev) => prev.concat(dataSavedOnDb));

      isWriting.current = false;
    },
    [identified, ports, technology]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isIdentifying.current && ports.length) {
        isIdentifying.current = true;
        const identified = await handleIdentificationProcess(ports);
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
  }, [ports, handleIdentificationProcess]);

  return {
    process,
    identified,
    handleDeviceIdentification,
    requestPort,
  };
};
