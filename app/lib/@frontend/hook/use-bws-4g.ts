import { useCallback } from "react";
import {
  Bws4g,
  Bws4GEncoder,
  Bws4gParser,
} from "../../@backend/infra/protocol";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Bws4GConfig,
  Device,
  IConfigurationProfile,
} from "../../@backend/domain";

namespace Namespace {
  interface Equipment {
    firmware: string;
    serial: string;
    imei?: string | undefined;
    iccid?: string | undefined;
    lora_keys?: Partial<Device.Equipment["lora_keys"]>;
  }
  export interface Detected {
    port: ISerialPort;
    equipment: Equipment;
  }

  export type Profile = IConfigurationProfile<Bws4GConfig>["config"];

  export type ConfigKeys =
    | keyof NonNullable<Profile["general"]>
    | keyof NonNullable<Profile["specific"]>;
}

type LineMatcher =
  | string // trecho que deve aparecer na linha
  | RegExp // regex que deve dar match
  | ((line: string) => boolean) // função que decide se a linha serve
  | null
  | undefined; // nenhum critério → devolve a primeira linha

export const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  matcher?: LineMatcher,
  timeout = 3000
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

      buffer += decoder.decode(value);

      console.log("[RAW DATA]", buffer);

      const lines = buffer.split("\r\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.length) continue;

        // ── Sem critério: retorna a primeira linha ───────────────────────────────
        if (!matcher) return line;

        // ── String: includes ────────────────────────────────────────────────────
        if (typeof matcher === "string" && line.includes(matcher)) return line;

        // ── RegExp: test() ──────────────────────────────────────────────────────
        if (matcher instanceof RegExp && matcher.test(line)) return line;

        // ── Função-predicado ────────────────────────────────────────────────────
        if (typeof matcher === "function" && matcher(line)) return line;
      }
    }
    return undefined;
  })();

  return Promise.race([readPromise, timeoutPromise]);
};

const generateMessages = (
  profile: IConfigurationProfile
): Record<Namespace.ConfigKeys, string> => {
  const response = {} as Record<Namespace.ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([command, args]) => {
    const _message = Bws4GEncoder.encoder({ command, args } as any);
    if (!_message) return;
    response[command as Namespace.ConfigKeys] = _message;
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
      });
    },
    closeTransport: closePort,
    sendMessage: async (
      port,
      msg: Message<string, { matcher?: LineMatcher; delay_before?: number }>
    ) => {
      const reader = await getReader(port);
      const { command, timeout, delay_before, matcher } = msg;
      if (delay_before) await sleep(delay_before);
      console.log("-------------------------");
      console.log("[MESSAGE SENT]", command);
      await writeToPort(port, command);
      const response = await readResponse(reader, matcher, timeout);
      console.log("[RESPONSE MATCHED]", response);
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

  // functions to interact with BWS4G via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { command: "DF\r\n", key: "debug_off", matcher: "Debug OFF" },
        {
          command: "IMEI",
          key: "imei",
          transform: Bws4gParser.imei,
          delay_before: 1000,
        },
        { command: "ICCID", key: "iccid", transform: Bws4gParser.iccid },
        { command: "ET", key: "firmware", transform: Bws4gParser.firmware },
        { command: "DN\r\n", key: "debug_on", matcher: "Debug ON" },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return { port, response: { ...response, serial: response.imei } };
          } catch (error) {
            console.error("[ERROR] handleDetection use-bws-4g", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleGetConfig = useCallback(
    async (detected: Namespace.Detected[]) => {
      const messages = [
        { command: "CHECK", key: "check" },
        { command: "CXIP", key: "cxip" },
        { command: "STATUS", key: "status" },
      ] as const;
      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            const { check, cxip, status } = response;
            const {
              data_transmission_off,
              data_transmission_on,
              apn,
              keep_alive,
              ...processed_check
            } = Bws4gParser.check(check) ?? {};
            const processed_status = Bws4gParser.status(status);
            const ip_primary = Bws4gParser.ip_primary(cxip);
            const ip_secondary = Bws4gParser.ip_secondary(cxip);
            const dns_primary = Bws4gParser.dns(cxip);
            const horimeter = processed_status?.HR
              ? Bws4gParser.horimeter(processed_status.HR)
              : undefined;
            return {
              port,
              equipment,
              config: {
                general: {
                  data_transmission_on,
                  data_transmission_off,
                  ip_primary,
                  ip_secondary,
                  apn,
                  keep_alive,
                  dns_primary,
                },
                specific: {
                  ...processed_check,
                  horimeter,
                },
              },
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
            };
          } catch (error) {
            console.error("[ERROR] handleGetConfig use-e3-plus-4g", error);
            return { port, equipment, messages: [], config: {} };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleConfiguration = useCallback(
    async (
      detected: Namespace.Detected[],
      configuration_profile: IConfigurationProfile
    ) => {
      const messages = [
        ...typedObjectEntries(generateMessages(configuration_profile)).map(
          ([key, command]) => ({
            key,
            command,
          })
        ),
        { command: "CHECK", key: "check", delay_before: 1000 },
        { command: "CXIP", key: "cxip" },
        { command: "STATUS", key: "status" },
      ] as const;
      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            const end_time = Date.now();
            const responseEntries = Object.entries(response ?? {});
            const { check, status, cxip } = response;
            const {
              data_transmission_off,
              data_transmission_on,
              apn,
              keep_alive,
              ...processed_check
            } = Bws4gParser.check(check) ?? {};
            const processed_status = Bws4gParser.status(status);
            const ip_primary = Bws4gParser.ip_primary(cxip);
            const ip_secondary = Bws4gParser.ip_secondary(cxip);
            const dns_primary = Bws4gParser.dns(cxip);
            const horimeter = processed_status?.HR
              ? Bws4gParser.horimeter(processed_status.HR)
              : undefined;
            return {
              equipment,
              port,
              init_time,
              end_time,
              status:
                responseEntries.length > 0 &&
                responseEntries.every(
                  ([_, value]) => typeof value !== "undefined"
                ),
              applied_profile: {
                general: {
                  data_transmission_on,
                  data_transmission_off,
                  ip_primary,
                  ip_secondary,
                  apn,
                  keep_alive,
                  dns_primary,
                },
                specific: {
                  ...processed_check,
                  horimeter,
                },
              },
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
            };
          } catch (error) {
            console.error("[ERROR] handleConfiguration  use-e3-plus-4g", error);
            return {
              port,
              status: false,
              equipment,
              messages: [],
              init_time: 0,
              end_time: 0,
            };
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
            response: {} as Record<string, Bws4g.AutoTest | string | undefined>,
            messages: [
              { key: "start", command: "START" },
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
              messages: [
                { command: "DF\r\n", key: "debug_off", matcher: "Debug OFF" },
                { key: "start", command: "START", delay_before: 1000 },
              ] as const,
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
                      transform: Bws4gParser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const BATT_VOLT = Number(autotest["BATT_VOLT"]);
                const VCC = Number(autotest["VCC"]);
                const TEMP = Number(autotest["TEMP"]);

                const isBattGood =
                  !isNaN(BATT_VOLT) && BATT_VOLT <= 450 && BATT_VOLT >= 400;

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_4G",
                  ACELC: Boolean(autotest["ACELC"]?.length),
                  ACELP: autotest["ACELP"] === "OK",
                  BATT_VOLT: lastBattResult || isBattGood,
                  CHARGER: autotest["CHARGER"] === "OK",
                  FW: Boolean(autotest["FW"]?.length),
                  GPS: autotest["GPS"] === "OK",
                  // GPSf: autotest["GPSf"] === "OK",
                  IC: isIccid(autotest["IC"] ?? ""),
                  ID_ACEL: Boolean(autotest["ID_ACEL"]?.length),
                  // ID_MEM: Boolean(autotest["ID_MEM"]?.length),
                  IM: isImei(autotest["IM"] ?? ""),
                  IN1: autotest["IN1"] === "OK",
                  IN2: autotest["IN2"] === "OK",
                  MDM: autotest["MDM"] === "OK",
                  OUT: autotest["OUT"] === "OK",
                  RSI: autotest["RSI"] === "OK",
                  SN: Boolean(autotest["SN"]?.length),
                  VCC: !isNaN(VCC) && VCC <= 1400 && VCC >= 1200,
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

            await sendMultipleMessages({
              transport: port,
              messages: [
                { key: "debug_on", command: "DN\r\n", matcher: "Debug ON" },
              ] as const,
            });

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
    async (port: ISerialPort, identifier: string) => {
      const messages = [
        {
          key: "imei",
          command: `13041SETSN,${identifier}`,
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
        console.error("[ERROR] handleIdentification e3-plus-4g", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );
  const handleGetIdentification = useCallback(
    async (port: ISerialPort) => {
      const messages = [
        { command: "IMEI", key: "imei", transform: Bws4gParser.imei },
      ] as const;
      try {
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });
        return { port, response: { ...response, serial: response.imei } };
      } catch (error) {
        console.error("[ERROR] handleGetIdentification e3-plus-4g", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );

  const isIdentified = (input?: {
    imei?: string;
    iccid?: string;
    firmware?: string;
  }): "fully_identified" | "partially_identified" | "not_identified" => {
    if (!input) return "not_identified";
    const { imei, iccid, firmware } = input;
    const identified = [imei, iccid, firmware];
    if (identified.every((e) => e && e?.length > 0)) {
      return "fully_identified";
    } else if (identified.some((e) => e && e?.length > 0)) {
      return "partially_identified";
    } else {
      return "not_identified";
    }
  };

  return {
    isIdentified,
    ports,
    handleIdentification,
    handleGetConfig,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
    handleGetIdentification,
  };
};
