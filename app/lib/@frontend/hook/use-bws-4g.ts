import { useCallback } from "react";
import { IConfigurationProfile } from "../../@backend/domain";
import {
  BWS4G,
  BWS4GEncoder,
  BWS4GParser,
} from "../../@backend/infra/protocol";
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
import { findOneSerial } from "../../@backend/action";
import { toast } from "./use-toast";

type ConfigKeys = keyof IConfigurationProfile["config"];

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string,
  timeout: number = 1000
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
    const _message = BWS4GEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useBWS4G = () => {
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
    sendMessage: async (port, msg) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout } = msg;
      await writeToPort(port, command);
      const response = await readResponse(reader, command, timeout);
      await reader.cancel();
      reader.releaseLock();
      return response;
    },
    options: {
      delayBetweenMessages: 200,
      maxRetriesPerMessage: 3,
      maxOverallRetries: 2,
    },
  });

  // functions to interact with E34G via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { command: "RIMEI\r\n", key: "imei", transform: BWS4GParser.imei },
        { command: "ICCID\r\n", key: "iccid", transform: BWS4GParser.iccid },
        { command: "RINS\r\n", key: "serial", transform: BWS4GParser.serial },
        {
          command: "RFW\r\n",
          key: "firmware",
          transform: BWS4GParser.firmware,
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
        {
          command: "RODM\r\n",
          key: "odometer",
          transform: BWS4GParser.odometer,
        },
        {
          command: "RCN\r\n",
          key: "data_transmission_on",
          transform: BWS4GParser.data_transmission_on,
        },
        {
          command: "RCW\r\n",
          key: "data_transmission_off",
          transform: BWS4GParser.data_transmission_off,
        },
        {
          command: "RCE\r\n",
          key: "data_transmission_event",
          transform: BWS4GParser.data_transmission_event,
        },
        { command: "RCS\r\n", key: "sleep", transform: BWS4GParser.sleep },
        {
          command: "RCK\r\n",
          key: "keep_alive",
          transform: BWS4GParser.keep_alive,
        },
        {
          command: "RIP1\r\n",
          key: "ip_primary",
          transform: BWS4GParser.ip_primary,
        },
        {
          command: "RIP2\r\n",
          key: "ip_secondary",
          transform: BWS4GParser.ip_secondary,
        },
        {
          command: "RID1\r\n",
          key: "dns_primary",
          transform: BWS4GParser.dns_primary,
        },
        {
          command: "RID2\r\n",
          key: "dns_secondary",
          transform: BWS4GParser.dns_secondary,
        },
        { command: "RIAP\r\n", key: "apn", transform: BWS4GParser.apn },
        {
          command: "RIG12\r\n",
          key: "first_voltage",
          transform: BWS4GParser.first_voltage,
        },
        {
          command: "RIG24\r\n",
          key: "second_voltage",
          transform: BWS4GParser.second_voltage,
        },
        { command: "RFA\r\n", key: "angle", transform: BWS4GParser.angle },
        { command: "RFV\r\n", key: "speed", transform: BWS4GParser.speed },
        {
          command: "RFTON\r\n",
          key: "accelerometer_sensitivity_on",
          transform: BWS4GParser.accelerometer_sensitivity_on,
        },
        {
          command: "RFTOF\r\n",
          key: "accelerometer_sensitivity_off",
          transform: BWS4GParser.accelerometer_sensitivity_off,
        },
        {
          command: "RFAV\r\n",
          key: "accelerometer_sensitivity_violated",
          transform: BWS4GParser.accelerometer_sensitivity_violated,
        },
        {
          command: "RFMA\r\n",
          key: "maximum_acceleration",
          transform: BWS4GParser.maximum_acceleration,
        },
        {
          command: "RFMD\r\n",
          key: "maximum_deceleration",
          transform: BWS4GParser.maximum_deceleration,
        },
        { command: "RIN1\r\n", key: "input_1", transform: BWS4GParser.input_1 },
        { command: "RIN2\r\n", key: "input_2", transform: BWS4GParser.input_2 },
        { command: "RIN3\r\n", key: "input_3", transform: BWS4GParser.input_3 },
        { command: "RIN4\r\n", key: "input_4", transform: BWS4GParser.input_4 },
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
        ([key, command]) => ({
          key,
          command,
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
            response: {} as Record<string, BWS4G.AutoTest | string | undefined>,
            messages: [
              { key: "start", command: "START\r\n" },
              { key: "autotest_1", command: "AUTOTEST" },
              { key: "autotest_2", command: "AUTOTEST" },
              { key: "autotest_3", command: "AUTOTEST" },
              { key: "autotest_4", command: "AUTOTEST" },
              { key: "autotest_5", command: "AUTOTEST" },
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
              messages: [{ key: "start", command: "START\r\n" }] as const,
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
                      command: "AUTOTEST",
                      transform: BWS4GParser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const BATT_VOLT = Number(autotest["BATT_VOLT"]);
                const VCC = Number(autotest["VCC"]);
                const TEMP = Number(autotest["TEMP"]);

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_4G",
                  ACELC: Boolean(autotest["ACELC"]?.length),
                  ACELP: autotest["ACELP"] === "OK",
                  BATT_VOLT:
                    !isNaN(BATT_VOLT) && BATT_VOLT <= 430 && BATT_VOLT >= 400,
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
                  VCC: !isNaN(VCC) && VCC <= 1300 && VCC >= 1200,
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
      const identification = await findOneSerial({ serial });
      if (!identification) {
        toast({
          title: "Serial não encontrado",
          variant: "error",
          description: `Dispositivo com o serial: ${serial} não encontrado`,
        });
        return { port };
      }
      const messages = [
        {
          key: "serial",
          command: `WINS=${serial}\r\n`,
        },
        {
          key: "imei",
          command: `WIMEI=${identification.imei}\r\n`,
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
        { command: "RINS\r\n", key: "serial", transform: BWS4GParser.serial },
        { command: "RIMEI\r\n", key: "imei", transform: BWS4GParser.imei },
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
