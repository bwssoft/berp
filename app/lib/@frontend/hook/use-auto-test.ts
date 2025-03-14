import { useCallback, useEffect, useRef, useState } from "react";
import { IAutoTestLog, ITechnology } from "../../@backend/domain";
import { ISerialPort } from "./use-serial-port";
import { useTechnology } from "./use-technology";
import { createManyAutoTestLog } from "../../@backend/action/production/auto-test-log.action";

namespace Namespace {
  export interface UseConfigurationProps {
    technology: ITechnology | null;
  }

  export interface Identified {
    port: ISerialPort;
    equipment: Equipment;
  }

  interface Equipment {
    imei: string | undefined;
    iccid: string | undefined;
    et: string | undefined;
  }

  export interface Configuration extends IAutoTestLog {}
}

export const useAutoTest = (props: Namespace.UseConfigurationProps) => {
  const { technology } = props;
  const [identified, setIdentified] = useState<Namespace.Identified[]>([]);
  const isIdentifying = useRef(false);

  const [autotest, setAutoTest] = useState<Namespace.Configuration[]>([]);
  const isAutoTesting = useRef(false);

  // hook that handle interactions with devices
  const {
    ports,
    handleIdentificationProcess,
    handleAutoTestProcess,
    requestPort,
  } = useTechnology(technology);

  // function that handle with auto test process, check if the process was successful and save result on database
  const handleAutoTest = useCallback(async () => {
    isAutoTesting.current = true;

    // run auto test devices
    const autoTestResult = await handleAutoTestProcess(
      identified
        .filter((i) => i.equipment.imei && i.equipment.et)
        .map(({ port }) => port)
    );

    // check if each message sent has response
    const result = autoTestResult
      .map(({ port, response, messages, end_time, init_time, analysis }) => {
        if (!response || !messages || !end_time || !init_time || !analysis)
          return undefined;

        const { equipment } = identified.find((el) => el.port === port) ?? {};

        if (!equipment || !technology) return undefined;

        const log: Omit<IAutoTestLog, "id" | "created_at" | "user_id"> = {
          analysis,
          equipment: {
            imei: equipment.imei!,
            et: equipment.et!,
            iccid: equipment.iccid,
          },
          is_successful: Object.entries(analysis).every(
            ([_, value]) => value === true
          ),
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

        return log;
      })
      .filter((el): el is NonNullable<typeof el> => el !== undefined);

    // save result on database
    const dataSavedOnDb = await createManyAutoTestLog(result);

    // update state with configuration process result
    setAutoTest((prev) => prev.concat(dataSavedOnDb));

    isAutoTesting.current = false;
  }, [identified, ports, technology]);

  // useEffect used to identify devices when connected to serial ports
  useEffect(() => {
    (async () => {
      if (!isIdentifying.current && ports.length) {
        isIdentifying.current = true;
        const identified = await handleIdentificationProcess(ports);
        setIdentified(
          identified
            .filter((el) => typeof el.response !== "undefined")
            .map(({ port, response }) => ({ port, equipment: response }))
        );
        isIdentifying.current = false;
      } else if (!isIdentifying.current && !ports.length) {
        setIdentified([]);
      }
    })();
  }, [ports]);

  return {
    autotest,
    identified,
    handleAutoTest,
    requestPort,
  };
};
