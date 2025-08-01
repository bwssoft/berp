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
    status: "fully_identified" | "partially_identified" | "not_identified";
  }

  interface Equipment {
    imei?: string | undefined;
    iccid?: string | undefined;
    firmware?: string | undefined;
    serial?: string | undefined;
  }

  export interface AutoTest extends IAutoTestLog {}
}

const mapAutoTestResultToLog = (
  result: {
    port: ISerialPort;
    response?: any;
    messages?: ReadonlyArray<{ key: string; command: string }>;
    end_time?: number;
    init_time?: number;
    analysis?: any;
    status?: boolean;
  },
  detected: Namespace.Identified[],
  technology: ITechnology
): Omit<IAutoTestLog, "id" | "created_at" | "user"> | undefined => {
  // Verifica campos obrigatórios
  if (
    !result.response ||
    !result.messages ||
    !result.end_time ||
    !result.init_time ||
    !result.analysis ||
    typeof result.status !== "boolean"
  ) {
    return undefined;
  }

  const equipment = detected.find(
    (device) => device.port === result.port
  )?.equipment;

  if (!equipment) return undefined;

  return {
    analysis: result.analysis,
    equipment: {
      imei: equipment.imei!,
      firmware: equipment.firmware!,
      serial: equipment.serial!,
      iccid: equipment.iccid,
    },
    status: result.status,
    // metadata: {
    //   messages: result.messages.map(({ key, command }) => ({
    //     request: command,
    //     response: result.response[key],
    //   })),
    //   end_time: result.end_time,
    //   init_time: result.init_time,
    // },
    technology: {
      id: technology.id,
      system_name: technology.name.system,
    },
  };
};

export const useAutoTest = (props: Namespace.UseAutoTestProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [autoTest, setAutoTest] = useState<Namespace.AutoTest[]>([]);
  const isAutoTesting = useRef(false);

  const [detectionProgress, setDetectionProgress] = useState(false);
  const [autoTestProgress, setAutoTestProgress] = useState(false);

  // hook that handle interactions with devices
  const { ports, handleDetection, handleAutoTest, requestPort, isIdentified } =
    useTechnology(technology);

  // function that handle the auto test process, check if the process was successful and save result on database
  const test = useCallback(async () => {
    try {
      if (!technology) return;

      // update isAutoTesting reference to true to prevent multiple auto test processes
      isAutoTesting.current = true;
      setAutoTestProgress(true);

      // run auto test devices
      const autoTestResult = await handleAutoTest(
        identified
          .filter((i) => i.equipment.serial && i.equipment.firmware)
          .map(({ port }) => port)
      );

      // check if each message sent has response
      const result = autoTestResult
        .map((log) => mapAutoTestResultToLog(log, identified, technology))
        .filter((el): el is NonNullable<typeof el> => el !== undefined);

      // save result on database
      const res = await fetch("/api/production/auto-test-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Erro ao salvar log de auto test");
      const dataSavedOnDb = await res.json();

      // update state with configuration process result
      setAutoTest((prev) => prev.concat(dataSavedOnDb));

      isAutoTesting.current = false;
      setAutoTestProgress(false);
    } catch (error) {
      console.error("Error during auto test:", error);
      isAutoTesting.current = false;
      setAutoTestProgress(false);
    }
  }, [handleAutoTest, identified, technology]);

  const detect = useCallback(
    (ports: ISerialPort[]) => {
      if (isAutoTesting.current) return;
      if (isIdentifying.current && ports.length) return;
      isIdentifying.current = true;
      setDetectionProgress(true);
      handleDetection(ports).then((identified) => {
        setIdentified(
          identified
            .filter((el) => el.response !== undefined)
            .map(({ port, response }) => ({
              port,
              equipment: response!,
              status: isIdentified(response!),
            }))
        );
        setDetectionProgress(false);
        isIdentifying.current = false;
      });
    },
    [handleDetection]
  );

  // useEffect used to identify devices when connected via serial ports
  useEffect(() => {
    const interval = setInterval(() => detect(ports), 5000); // 5000 ms = 5 segundos
    return () => clearInterval(interval);
  }, [ports, detect]);

  return {
    autoTest,
    identified,
    test,
    requestPort,
    progress: {
      autoTest: autoTestProgress,
      detection: detectionProgress,
    },
  };
};
