"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IAutoTestLog, ITechnology } from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import { createManyAutoTestLog } from "../../@backend/action/production/auto-test-log.action";

namespace Namespace {
  export interface UseAutoTestProps {
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

  export interface AutoTest extends IAutoTestLog {}
}

export const useAutoTest = (props: Namespace.UseAutoTestProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [autoTest, setAutoTest] = useState<Namespace.AutoTest[]>([]);
  const isAutoTesting = useRef(false);

  // hook that handle interactions with devices
  const { ports, handleDetection, handleAutoTest, requestPort } =
    useTechnology(technology);

  // function that handle the auto test process, check if the process was successful and save result on database
  const test = useCallback(async () => {
    isAutoTesting.current = true;

    // run auto test devices
    const autoTestResult = await handleAutoTest(
      identified
        .filter((i) => i.equipment.imei && i.equipment.firmware)
        .map(({ port }) => port)
    );

    // check if each message sent has response
    const result = autoTestResult
      .map(
        ({
          port,
          response,
          messages,
          end_time,
          init_time,
          analysis,
          status,
        }) => {
          if (!response || !messages || !end_time || !init_time || !analysis)
            return undefined;

          const { equipment } = identified.find((el) => el.port === port) ?? {};

          if (!equipment || !technology) return undefined;

          const log: Omit<IAutoTestLog, "id" | "created_at" | "user"> = {
            analysis,
            equipment: {
              imei: equipment.imei!,
              firmware: equipment.firmware!,
              serial: equipment.serial!,
              iccid: equipment.iccid,
            },
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

          return log;
        }
      )
      .filter((el): el is NonNullable<typeof el> => el !== undefined);

    // save result on database
    const dataSavedOnDb = await createManyAutoTestLog(result);

    // update state with configuration process result
    setAutoTest((prev) => prev.concat(dataSavedOnDb));

    isAutoTesting.current = false;
  }, [handleAutoTest, identified, technology]);

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(async () => {
      if (isAutoTesting.current) return;
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
    autoTest,
    identified,
    test,
    requestPort,
  };
};
