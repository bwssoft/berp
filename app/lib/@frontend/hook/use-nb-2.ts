import { useCallback } from "react";
import { NB2, NB2Parser, NB2Encoder } from "../../@backend/infra/protocol";
import {
  generateImei,
  getRandomInt,
  isIccid,
  isImei,
  sleep,
  typedObjectEntries,
} from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";

type ConfigKeys = keyof IConfigurationProfile["config"];

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string,
  timeout: number = 500
): Promise<string | undefined> => {
  const decoder = new TextDecoder();
  let buffer = "";
  const timeoutPromise = new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), timeout)
  );

  const readPromise = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      buffer += chunk;

      let lines = buffer.split("\r\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.length > 0 && line.includes(command.replace("\r\n", ""))) {
          return line;
        }
      }
    }
    return undefined;
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
    const _message = NB2Encoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useNB2 = () => {
  const { ports, openPort, closePort, getReader, writeToPort, requestPort } =
    useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: async (transport) => {
      await openPort(transport, {
        baudRate: 115200,
        stopBits: 2,
      });
    },
    closeTransport: closePort,
    sendMessage: async (port, message, timeout) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      await writeToPort(port, message);
      const response = await readResponse(reader, message, timeout);
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
        { message: "RIMEI\r\n", key: "imei", transform: NB2Parser.imei },
        { message: "ICCID\r\n", key: "iccid", transform: NB2Parser.iccid },
        { message: "RINS\r\n", key: "serial", transform: NB2Parser.serial },
        {
          message: "RFW\r\n",
          key: "firmware",
          transform: NB2Parser.firmware,
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
        { message: "RODM\r\n", key: "odometer", transform: NB2Parser.odometer },
        {
          message: "RCN\r\n",
          key: "data_transmission_on",
          transform: NB2Parser.data_transmission_on,
        },
        {
          message: "RCW\r\n",
          key: "data_transmission_off",
          transform: NB2Parser.data_transmission_off,
        },
        {
          message: "RCE\r\n",
          key: "data_transmission_event",
          transform: NB2Parser.data_transmission_event,
        },
        { message: "RCS\r\n", key: "sleep", transform: NB2Parser.sleep },
        {
          message: "RCK\r\n",
          key: "keep_alive",
          transform: NB2Parser.keep_alive,
        },
        {
          message: "RIP1\r\n",
          key: "ip_primary",
          transform: NB2Parser.ip_primary,
        },
        {
          message: "RIP2\r\n",
          key: "ip_secondary",
          transform: NB2Parser.ip_secondary,
        },
        {
          message: "RID1\r\n",
          key: "dns_primary",
          transform: NB2Parser.dns_primary,
        },
        {
          message: "RID2\r\n",
          key: "dns_secondary",
          transform: NB2Parser.dns_secondary,
        },
        { message: "RIAP\r\n", key: "apn", transform: NB2Parser.apn },
        {
          message: "RIG12\r\n",
          key: "first_voltage",
          transform: NB2Parser.first_voltage,
        },
        {
          message: "RIG24\r\n",
          key: "second_voltage",
          transform: NB2Parser.second_voltage,
        },
        { message: "RFA\r\n", key: "angle", transform: NB2Parser.angle },
        { message: "RFV\r\n", key: "speed", transform: NB2Parser.speed },
        {
          message: "RFTON\r\n",
          key: "accelerometer_sensitivity_on",
          transform: NB2Parser.accelerometer_sensitivity_on,
        },
        {
          message: "RFTOF\r\n",
          key: "accelerometer_sensitivity_off",
          transform: NB2Parser.accelerometer_sensitivity_off,
        },
        {
          message: "RFAV\r\n",
          key: "accelerometer_sensitivity_violated",
          transform: NB2Parser.accelerometer_sensitivity_violated,
        },
        {
          message: "RFMA\r\n",
          key: "maximum_acceleration",
          transform: NB2Parser.maximum_acceleration,
        },
        {
          message: "RFMD\r\n",
          key: "maximum_deceleration",
          transform: NB2Parser.maximum_deceleration,
        },
        { message: "RIN1\r\n", key: "input_1", transform: NB2Parser.input_1 },
        { message: "RIN2\r\n", key: "input_2", transform: NB2Parser.input_2 },
        { message: "RIN3\r\n", key: "input_3", transform: NB2Parser.input_3 },
        { message: "RIN4\r\n", key: "input_4", transform: NB2Parser.input_4 },
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
            response: {} as Record<string, NB2.AutoTest | string | undefined>,
            messages: [
              { key: "start", message: "START\r\n" },
              { key: "autotest_1", message: "AUTOTEST" },
              { key: "autotest_2", message: "AUTOTEST" },
              { key: "autotest_3", message: "AUTOTEST" },
              { key: "autotest_4", message: "AUTOTEST" },
              { key: "autotest_5", message: "AUTOTEST" },
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
              messages: [{ key: "start", message: "START\r\n" }] as const,
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
                      message: "AUTOTEST",
                      transform: NB2Parser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const BATT_VOLT = Number(autotest["BATT_VOLT"]);
                const VCC = Number(autotest["VCC"]);
                const TEMP = Number(autotest["TEMP"]);

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_NB2",
                  ACELC: Boolean(autotest["ACELC"]?.length),
                  ACELP: autotest["ACELP"] === "OK",
                  BATT_VOLT:
                    !isNaN(BATT_VOLT) && BATT_VOLT <= 43 && BATT_VOLT >= 40,
                  CHARGER: autotest["CHARGER"] === "OK",
                  FW: Boolean(autotest["FW"]?.length),
                  GPS: autotest["GPS"] === "OK",
                  // GPSf: autotest["GPSf"] === "OK",
                  IC: isIccid(autotest["IC"] ?? ""),
                  ID_ACEL: Boolean(autotest["ID_ACEL"]?.length),
                  ID_MEM: Boolean(autotest["ID_MEM"]?.length),
                  IM: isImei(autotest["IM"] ?? ""),
                  IN1: autotest["IN1"] === "OK",
                  IN2: autotest["IN2"] === "OK",
                  MDM: autotest["MDM"] === "OK",
                  OUT: autotest["OUT"] === "OK",
                  RSI: autotest["RSI"] === "OK",
                  SN: Boolean(autotest["SN"]?.length),
                  VCC: !isNaN(VCC) && VCC <= 130 && VCC >= 120,
                  TEMP: !isNaN(TEMP) && TEMP <= 28 && TEMP >= 23,
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
      const imei = await handleGetRandomImei();
      const messages = [
        {
          key: "serial",
          message: `WINS=${serial}\r\n`,
        },
        {
          key: "imei",
          message: `WIMEI=${imei}\r\n`,
        },
      ] as const;
      try {
        const init_time = Date.now();
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });
        const end_time = Date.now();
        return {
          port,
          response,
          messages,
          init_time,
          end_time,
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
        { message: "RINS\r\n", key: "serial", transform: NB2Parser.serial },
        { message: "RIMEI\r\n", key: "imei", transform: NB2Parser.imei },
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

  const isIdentified = (input: {
    imei?: string;
    iccid?: string;
    serial?: string;
    firmware?: string;
  }) => {
    const { serial, imei, iccid, firmware } = input;
    const identified = [serial, imei, iccid, firmware];
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
