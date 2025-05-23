import { useCallback } from "react";
import { LORA, LORAParser, LORAEncoder } from "../../@backend/infra/protocol";
import {
  generateImei,
  getRandomInt,
  sleep,
  typedObjectEntries,
} from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";
import { getDayZeroTimestamp } from "../../util/get-day-zero-timestamp";

type ConfigKeys = keyof IConfigurationProfile["config"];

const defaultDecode = (command: string, buffer: string, state: string[]) => {
  let lines = buffer.split("\r");
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (line.length > 0 && line.includes(command.replace("\r", ""))) {
      return line;
    }
  }
};

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  timeout: number = 500,
  command: string,
  decode: (
    command: string,
    buffer: string,
    state: string[]
  ) => void = defaultDecode
): Promise<string[]> => {
  const decoder = new TextDecoder();
  let buffer = "";
  const timeoutPromise = new Promise<[]>((resolve) =>
    setTimeout(() => resolve([]), timeout)
  );

  const readPromise = (async () => {
    const state: string[] = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      buffer += chunk;

      decode(command, buffer, state);
    }

    return state;
  })();

  return Promise.race([readPromise, timeoutPromise]);
};

const generateMessages = (
  profile: IConfigurationProfile
): Record<ConfigKeys, string> => {
  const response = {} as Record<ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([message, args]) => {
    const _message = LORAEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useLora = () => {
  const { ports, openPort, closePort, getReader, writeToPort, requestPort } =
    useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: async (transport) => {
      await openPort(transport, {
        baudRate: 115200,
        stopBits: 1,
      });
    },
    closeTransport: closePort,
    sendMessage: async (port, command, timeout, decode) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      await writeToPort(port, command);
      const [response] = await readResponse(reader, timeout, command, decode);
      await reader.cancel();
      reader.releaseLock();
      return response;
    },
    options: {
      delayBetweenMessages: 550,
      maxRetriesPerMessage: 3,
      maxOverallRetries: 2,
    },
  });

  // functions to interact with E34G via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "RINS\r", key: "serial", transform: LORAParser.serial },
        {
          message: "RFW\r",
          key: "firmware",
          transform: LORAParser.firmware,
        },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return { port, response };
          } catch (error) {
            console.error("[ERROR] handleDetection", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleGetProfile = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "RODM\r", key: "odometer", transform: LORAParser.odometer },
        {
          message: "RCN\r",
          key: "data_transmission_on",
          transform: LORAParser.data_transmission_on,
        },
        {
          message: "RCW\r",
          key: "data_transmission_off",
          transform: LORAParser.data_transmission_off,
        },
        {
          message: "RCE\r",
          key: "data_transmission_event",
          transform: LORAParser.data_transmission_event,
        },
        { message: "RCS\r", key: "sleep", transform: LORAParser.sleep },
        {
          message: "RCK\r",
          key: "keep_alive",
          transform: LORAParser.keep_alive,
        },
        {
          message: "RIP1\r",
          key: "ip_primary",
          transform: LORAParser.ip_primary,
        },
        {
          message: "RIP2\r",
          key: "ip_secondary",
          transform: LORAParser.ip_secondary,
        },
        {
          message: "RID1\r",
          key: "dns_primary",
          transform: LORAParser.dns_primary,
        },
        {
          message: "RID2\r",
          key: "dns_secondary",
          transform: LORAParser.dns_secondary,
        },
        { message: "RIAP\r", key: "apn", transform: LORAParser.apn },
        {
          message: "RIG12\r",
          key: "first_voltage",
          transform: LORAParser.first_voltage,
        },
        {
          message: "RIG24\r",
          key: "second_voltage",
          transform: LORAParser.second_voltage,
        },
        { message: "RFA\r", key: "angle", transform: LORAParser.angle },
        { message: "RFV\r", key: "speed", transform: LORAParser.speed },
        {
          message: "RFTON\r",
          key: "accelerometer_sensitivity_on",
          transform: LORAParser.accelerometer_sensitivity_on,
        },
        {
          message: "RFTOF\r",
          key: "accelerometer_sensitivity_off",
          transform: LORAParser.accelerometer_sensitivity_off,
        },
        {
          message: "RFAV\r",
          key: "accelerometer_sensitivity_violated",
          transform: LORAParser.accelerometer_sensitivity_violated,
        },
        {
          message: "RFMA\r",
          key: "maximum_acceleration",
          transform: LORAParser.maximum_acceleration,
        },
        {
          message: "RFMD\r",
          key: "maximum_deceleration",
          transform: LORAParser.maximum_deceleration,
        },
        { message: "RIN1\r", key: "input_1", transform: LORAParser.input_1 },
        { message: "RIN2\r", key: "input_2", transform: LORAParser.input_2 },
        { message: "RIN3\r", key: "input_3", transform: LORAParser.input_3 },
        { message: "RIN4\r", key: "input_4", transform: LORAParser.input_4 },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const {
              data_transmission_on,
              data_transmission_off,
              ip_primary,
              ip_secondary,
              apn,
              keep_alive,
              dns_primary,
              dns_secondary,
              ...specific
            } = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return {
              port,
              config: {
                general: {
                  data_transmission_on,
                  data_transmission_off,
                  ip_primary,
                  ip_secondary,
                  apn,
                  keep_alive,
                  dns_primary,
                  dns_secondary,
                },
                specific,
              },
              raw: [],
            };
          } catch (error) {
            console.error("[ERROR] handleGetProfile", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleConfiguration = useCallback(
    async (
      ports: ISerialPort[],
      configuration_profile: IConfigurationProfile
    ) => {
      const generatedMessages = generateMessages(configuration_profile);
      const configurationCommands = typedObjectEntries(generatedMessages).map(
        ([key, message]) => ({
          key,
          message,
        })
      );
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages: configurationCommands,
            });
            const end_time = Date.now();
            const responseEntries = Object.entries(response ?? {});
            const status =
              responseEntries.length > 0 &&
              responseEntries.every(
                ([_, value]) => typeof value !== "undefined"
              );
            return {
              port,
              response,
              messages: configurationCommands,
              init_time,
              end_time,
              status,
            };
          } catch (error) {
            console.error("[ERROR] handleConfiguration", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleAutoTest = useCallback(
    async (ports: ISerialPort[]) => {
      return await Promise.all(
        ports.map(async (port) => {
          const resultTemplate = {
            port,
            response: {} as Record<string, LORA.AutoTest | string | undefined>,
            messages: [
              { key: "start", message: "START\r" },
              { key: "autotest_1", message: "AUTOTEST\r" },
              { key: "autotest_2", message: "AUTOTEST\r" },
              { key: "autotest_3", message: "AUTOTEST\r" },
              { key: "autotest_4", message: "AUTOTEST\r" },
              { key: "autotest_5", message: "AUTOTEST\r" },
            ],
            analysis: {} as Record<string, boolean>,
            init_time: Date.now(),
            end_time: 0,
            status: false,
          };

          try {
            // 1. Envia comando START
            const startResponse = await sendMultipleMessages({
              transport: port,
              messages: [{ key: "start", message: "START\r" }] as const,
            });
            resultTemplate.response["start"] = startResponse.start;

            // 2. Configuração do loop de AUTOTEST
            const autotestTimeout = 25000; // 25s timeout total
            const startTime = Date.now();
            let remainingAttempts = 5;

            while (
              remainingAttempts > 0 &&
              Date.now() - startTime < autotestTimeout
            ) {
              const key = `autotest_${5 - remainingAttempts + 1}`;
              try {
                await sleep(2000); // Intervalo entre tentativas

                const autotestResponse = await sendMultipleMessages({
                  transport: port,
                  messages: [
                    {
                      key,
                      message: "AUTOTEST\r",
                      transform: LORAParser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const ACELID = Number(autotest["ACELID"]);
                const ADMAIN = Number(autotest["ADMAIN"]);
                const ADBACK = Number(autotest["ADBACK"]);
                const ADNTC = Number(autotest["ADNTC"]);

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_LORA",
                  SN: typeof autotest["SN"] === "string",
                  FW: typeof autotest["FW"] === "string",
                  ACELID: !isNaN(ACELID),
                  ADMAIN: !isNaN(ADMAIN),
                  ADBACK: !isNaN(ADBACK),
                  ADNTC: !isNaN(ADNTC) && ADNTC !== 255,
                  ACELCOM: autotest["ACELCOM"] === "OK",
                  IN1: autotest["IN1"] === "OK",
                  IN2: autotest["IN2"] === "OK",
                  OUT1: autotest["OUT1"] === "OK",
                  CHARGER: autotest["CHARGER"] === "OK",
                  GPSCOM: autotest["GPSCOM"] === "OK",
                  GPSVCC: autotest["GPSVCC"] === "OK",
                  GPSRST: autotest["GPSRST"] === "OK",
                };

                const statusValues = Object.values(resultTemplate.analysis);

                resultTemplate.status =
                  statusValues.length > 0 &&
                  Object.values(resultTemplate.analysis).every(Boolean);

                resultTemplate.response[key] = autotest;

                if (resultTemplate.status) break;
              } catch (error) {
                console.warn(
                  `Attempt ${5 - remainingAttempts + 1} failed`,
                  error
                );
              }
              remainingAttempts--;
            }

            resultTemplate.end_time = Date.now();
            return resultTemplate;
          } catch (error) {
            console.error("[ERROR] handleAutoTest", error);
            resultTemplate.end_time = Date.now();
            return resultTemplate;
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleIdentification = useCallback(
    async (port: ISerialPort, serial: string) => {
      const timestamp = Number(getDayZeroTimestamp().toString().slice(0, -5));

      const writeMessages = [
        {
          key: "serial",
          message: `WINS=${serial}\r`,
        },
        {
          key: "timestamp",
          message: `WTK=${timestamp}\r`,
        },
      ] as const;

      const readMessages = [
        {
          key: "serial",
          message: `RINS\r`,
        },
        {
          key: "timestamp",
          message: `RTK\r`,
        },
        {
          key: "keys",
          message: `RKEYS\r`,
        },
      ] as const;
      try {
        const init_time = Date.now();
        const writeResponse = await sendMultipleMessages({
          transport: port,
          messages: writeMessages,
        });
        await sleep(2000);
        const readResponse = await sendMultipleMessages({
          transport: port,
          messages: readMessages,
        });
        console.log(readResponse);
        const end_time = Date.now();
        return {
          port,
          response: { ...writeResponse, ...readResponse },
          messages: [...writeMessages, ...readMessages],
          init_time,
          end_time,
          status: true,
        };
      } catch (error) {
        console.error("[ERROR] handleIdentification", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );
  const handleGetIdentification = useCallback(
    async (port: ISerialPort) => {
      const messages = [
        { message: "RINS\r", key: "serial", transform: LORAParser.serial },
      ] as const;
      try {
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });
        return { port, response };
      } catch (error) {
        console.error("[ERROR] handleGetIdentification", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );
  const handleGetRandomImei = async () => {
    return generateImei({ tac: 12345678, snr: getRandomInt(1, 1000000) });
  };

  const isIdentified = (input: { serial?: string; firmware?: string }) => {
    const { serial, firmware } = input;
    const identified = [serial, firmware];
    if (identified.every((e) => e && e.length > 0)) {
      return "fully_identified";
    } else if (identified.some((e) => e && e.length > 0)) {
      return "partially_identified";
    } else {
      return "not_identified";
    }
  };

  return {
    isIdentified,
    ports,
    handleIdentification,
    handleGetProfile,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
    handleGetIdentification,
  };
};
