import { useCallback } from "react";
import { NB2, NB2Parser, NB2Encoder } from "../../@backend/infra/protocol";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Config,
  IConfigurationProfile,
  NB2Config,
} from "../../@backend/domain";
import { findOneSerial } from "../../@backend/action/engineer/serial.action";

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
    sendMessage: async (port, msg: Message<string, { check?: string }>) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout, check } = msg;
      await writeToPort(port, command);
      const response = await readResponse(reader, check ?? command, timeout);
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
        { command: "RIMEI\r\n", key: "imei", transform: NB2Parser.imei },
        { command: "ICCID\r\n", key: "iccid", transform: NB2Parser.iccid },
        { command: "RINS\r\n", key: "serial", transform: NB2Parser.serial },
        {
          command: "RFW\r\n",
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
        {
          command: "RCN\r",
          key: "data_transmission_on",
          transform: NB2Parser.data_transmission_on,
        },
        {
          command: "RCW\r",
          key: "data_transmission_off",
          transform: NB2Parser.data_transmission_off,
        },
        {
          command: "RCE\r",
          key: "data_transmission_event",
          transform: NB2Parser.data_transmission_event,
        },
        {
          command: "RCK\r",
          key: "keep_alive",
          transform: NB2Parser.keep_alive,
        },

        {
          command: "RIP1\r",
          key: "ip_primary",
          transform: NB2Parser.ip_primary,
        },
        {
          command: "RIP2\r",
          key: "ip_secondary",
          transform: NB2Parser.ip_secondary,
        },
        {
          command: "RID1\r",
          key: "dns_primary",
          transform: NB2Parser.dns_primary,
        },
        {
          command: "RID2\r",
          key: "dns_secondary",
          transform: NB2Parser.dns_secondary,
        },
        { command: "RIAP\r", key: "apn", transform: NB2Parser.apn },

        {
          command: "RCS\r",
          key: "time_to_sleep",
          transform: NB2Parser.time_to_sleep,
        },
        { command: "RODM\r", key: "odometer", transform: NB2Parser.odometer },

        {
          command: "RIG12\r",
          key: "virtual_ignition_12v",
          transform: NB2Parser.virtual_ignition_12v,
        },
        {
          command: "RIG24\r",
          key: "virtual_ignition_24v",
          transform: NB2Parser.virtual_ignition_24v,
        },

        {
          command: "RFA\r",
          key: "heading_detection_angle",
          transform: NB2Parser.heading_detection_angle,
        },
        {
          command: "RFV\r",
          key: "speed_alert_threshold",
          transform: NB2Parser.speed_alert_threshold,
        },

        {
          command: "RFTON\r",
          key: "accel_threshold_for_ignition_on",
          transform: NB2Parser.accel_threshold_for_ignition_on,
        },
        {
          command: "RFTOF\r",
          key: "accel_threshold_for_ignition_off",
          transform: NB2Parser.accel_threshold_for_ignition_off,
        },
        {
          command: "RFAV\r",
          key: "accel_threshold_for_movement",
          transform: NB2Parser.accel_threshold_for_movement,
        },

        {
          command: "RFMA\r",
          key: "harsh_acceleration_threshold",
          transform: NB2Parser.harsh_acceleration_threshold,
        },
        {
          command: "RFMD\r",
          key: "harsh_braking_threshold",
          transform: NB2Parser.harsh_braking_threshold,
        },

        { command: "RIN1\r", key: "input_1", transform: NB2Parser.input_1 },
        { command: "RIN2\r", key: "input_2", transform: NB2Parser.input_2 },
        { command: "RIN3\r", key: "input_3", transform: NB2Parser.input_3 },
        { command: "RIN4\r", key: "input_4", transform: NB2Parser.input_4 },

        {
          command: "RC\r",
          key: "full_configuration_table",
          transform: NB2Parser.full_configuration_table,
        },
        {
          command: "RF\r",
          key: "full_functionality_table",
          transform: NB2Parser.full_functionality_table,
        },

        {
          command: "RFSM\r",
          key: "sleep_mode",
          transform: NB2Parser.sleep_mode,
        },
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
            response: {} as Record<string, NB2.AutoTest | string | undefined>,
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
            let lastBattResult = false;

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
                      transform: NB2Parser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const BATT_VOLT = Number(autotest["BATT_VOLT"]);
                const VCC = Number(autotest["VCC"]);
                const TEMP = Number(autotest["TEMP"]);

                const isBattGood =
                  !isNaN(BATT_VOLT) && BATT_VOLT <= 43 && BATT_VOLT >= 40;

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_NB2",
                  ACELC: Boolean(autotest["ACELC"]?.length),
                  ACELP: autotest["ACELP"] === "OK",
                  BATT_VOLT: lastBattResult || isBattGood,
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

                lastBattResult = resultTemplate.analysis.BATT_VOLT;

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
        return { ok: false, port, error: "Serial não encontrado na base" };
      }

      const writeMessages = [
        {
          key: "serial",
          command: `WINS=${serial}\r\n`,
          check: "WINS",
        },
        {
          key: "imei",
          command: `WIMEI=${identification.imei}\r\n`,
          check: "WIMEI",
        },
      ] as const;

      const readMessages = [
        {
          key: "serial",
          command: `RINS\r\n`,
          transform: NB2Parser.serial,
        },
        {
          key: "imei",
          command: `RIMEI\r\n`,
          transform: NB2Parser.imei,
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

        if (
          !readResponse.imei ||
          !isImei(readResponse.imei) ||
          !readResponse.serial
        ) {
          return { ok: false, port, error: "IMEI ou Serial inválido" };
        }

        const status =
          identification.serial === readResponse.serial &&
          identification.imei === readResponse.imei;

        const end_time = Date.now();

        return {
          port,
          response: writeResponse,
          messages: writeMessages,
          init_time,
          end_time,
          status,
          ok: true,
          equipment: {
            serial: readResponse.serial,
            imei: readResponse.imei,
          },
        };
      } catch (error) {
        console.error("[ERROR] handleIdentification", error);
        return {
          ok: false,
          port,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    },
    [sendMultipleMessages]
  );

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
  };
};
