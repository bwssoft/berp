import { useCallback } from "react";
import {
  NB2LORA,
  NB2LORAParser,
  NB2LORAEncoder,
} from "../../@backend/infra/protocol";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";
import { findOneSerial } from "../../@backend/action";
import { getDayZeroTimestamp } from "../../util/get-day-zero-timestamp";

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
    const _message = NB2LORAEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useNB2Lora = () => {
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
        { command: "RIMEI\r\n", key: "imei", transform: NB2LORAParser.imei },
        { command: "ICCID\r\n", key: "iccid", transform: NB2LORAParser.iccid },
        { command: "RINS\r\n", key: "serial", transform: NB2LORAParser.serial },
        {
          command: "RFW\r\n",
          key: "firmware",
          transform: NB2LORAParser.firmware,
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
          transform: NB2LORAParser.odometer,
        },
        {
          command: "RCN\r\n",
          key: "data_transmission_on",
          transform: NB2LORAParser.data_transmission_on,
        },
        {
          command: "RCW\r\n",
          key: "data_transmission_off",
          transform: NB2LORAParser.data_transmission_off,
        },
        {
          command: "RCE\r\n",
          key: "data_transmission_event",
          transform: NB2LORAParser.data_transmission_event,
        },
        { command: "RCS\r\n", key: "sleep", transform: NB2LORAParser.sleep },
        {
          command: "RCK\r\n",
          key: "keep_alive",
          transform: NB2LORAParser.keep_alive,
        },
        {
          command: "RIP1\r\n",
          key: "ip_primary",
          transform: NB2LORAParser.ip_primary,
        },
        {
          command: "RIP2\r\n",
          key: "ip_secondary",
          transform: NB2LORAParser.ip_secondary,
        },
        {
          command: "RID1\r\n",
          key: "dns_primary",
          transform: NB2LORAParser.dns_primary,
        },
        {
          command: "RID2\r\n",
          key: "dns_secondary",
          transform: NB2LORAParser.dns_secondary,
        },
        { command: "RIAP\r\n", key: "apn", transform: NB2LORAParser.apn },
        {
          command: "RIG12\r\n",
          key: "first_voltage",
          transform: NB2LORAParser.first_voltage,
        },
        {
          command: "RIG24\r\n",
          key: "second_voltage",
          transform: NB2LORAParser.second_voltage,
        },
        { command: "RFA\r\n", key: "angle", transform: NB2LORAParser.angle },
        { command: "RFV\r\n", key: "speed", transform: NB2LORAParser.speed },
        {
          command: "RFTON\r\n",
          key: "accelerometer_sensitivity_on",
          transform: NB2LORAParser.accelerometer_sensitivity_on,
        },
        {
          command: "RFTOF\r\n",
          key: "accelerometer_sensitivity_off",
          transform: NB2LORAParser.accelerometer_sensitivity_off,
        },
        {
          command: "RFAV\r\n",
          key: "accelerometer_sensitivity_violated",
          transform: NB2LORAParser.accelerometer_sensitivity_violated,
        },
        {
          command: "RFMA\r\n",
          key: "maximum_acceleration",
          transform: NB2LORAParser.maximum_acceleration,
        },
        {
          command: "RFMD\r\n",
          key: "maximum_deceleration",
          transform: NB2LORAParser.maximum_deceleration,
        },
        {
          command: "RIN1\r\n",
          key: "input_1",
          transform: NB2LORAParser.input_1,
        },
        {
          command: "RIN2\r\n",
          key: "input_2",
          transform: NB2LORAParser.input_2,
        },
        {
          command: "RIN3\r\n",
          key: "input_3",
          transform: NB2LORAParser.input_3,
        },
        {
          command: "RIN4\r\n",
          key: "input_4",
          transform: NB2LORAParser.input_4,
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
            response: {} as Record<
              string,
              NB2LORA.AutoTest | string | undefined
            >,
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
                      transform: NB2LORAParser.auto_test,
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
                  DEV: autotest["DEV"] === "DM_BWS_NB2_LORA",
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
                  RSSI: autotest["RSSI"] === "OK",
                  SN: Boolean(autotest["SN"]?.length),
                  VCC: !isNaN(VCC) && VCC <= 130 && VCC >= 120,
                  TEMP: !isNaN(TEMP) && TEMP <= 28 && TEMP >= 23,
                  RF: autotest["RF"] === "OK",
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
      const timestamp = Number(getDayZeroTimestamp().toString().slice(0, -5));

      const writeMessages = [
        {
          key: "serial",
          command: `WINS=${serial}\r\n`,
        },
        {
          key: "imei",
          command: `WIMEI=${identification.imei}\r\n`,
        },
        // {
        //   key: "timestamp",
        //   command: `LWTK=${timestamp}\r\n`,
        // },
      ] as const;

      const readMessages = [
        {
          key: "serial",
          command: `RINS\r\n`,
          transform: NB2LORAParser.serial,
        },
        {
          key: "imei",
          command: `RIMEI\r\n`,
          transform: NB2LORAParser.imei,
        },
        // {
        //   key: "tk",
        //   command: `LRTK\r\n`,
        //   check: "RTK",
        //   transform: NB2LORAParser.rtk,
        // },
        // {
        //   key: "da",
        //   command: `LRDA\r\n`,
        //   check: "RDA",
        //   transform: NB2LORAParser.rda,
        // },
        // {
        //   key: "de",
        //   command: `LRDE\r\n`,
        //   check: "RDE",
        //   transform: NB2LORAParser.rde,
        // },
        // {
        //   key: "ap",
        //   command: `LRAP\r\n`,
        //   check: "RAP",
        //   transform: NB2LORAParser.rap,
        // },
        // {
        //   key: "ak",
        //   command: `LRAK\r\n`,
        //   check: "RAK",
        //   transform: NB2LORAParser.rak,
        // },
        // {
        //   key: "ask",
        //   command: `LRASK\r\n`,
        //   check: "RASK",
        //   transform: NB2LORAParser.rask,
        // },
        // {
        //   key: "nk",
        //   command: `LRNK\r\n`,
        //   check: "RNK",
        //   transform: NB2LORAParser.rnk,
        // },
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
        const end_time = Date.now();

        if (
          !readResponse.imei ||
          !isImei(readResponse.imei) ||
          !readResponse.serial
          // !readResponse.tk ||
          // !readResponse.da ||
          // !readResponse.de ||
          // !readResponse.ap ||
          // !readResponse.ak ||
          // !readResponse.ask ||
          // !readResponse.nk
        ) {
          return { ok: false, port, error: "IMEI ou Serial inválido" };
        }

        const status =
          identification.serial === readResponse.serial &&
          identification.imei === readResponse.imei;

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
            lora_keys: {
              // tk: readResponse.tk,
              // da: readResponse.da,
              // de: readResponse.de,
              // ap: readResponse.ap,
              // ak: readResponse.ak,
              // ask: readResponse.ask,
              // nk: readResponse.nk,
            },
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
