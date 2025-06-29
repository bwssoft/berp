import { useCallback, useEffect, useRef, useState } from "react";
import { E34GEncoder, E34GParser } from "../../@backend/infra/protocol";
import { isIccid, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Device,
  E3Plus4GConfig,
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

  export type Profile = IConfigurationProfile<E3Plus4GConfig>["config"];

  export type ConfigKeys =
    | keyof NonNullable<Profile["general"]>
    | keyof NonNullable<Profile["specific"]>;
}

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  timeout: number = 3000
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
        if (line.length > 0) {
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
): Record<Namespace.ConfigKeys, string> => {
  const response = {} as Record<Namespace.ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([command, args]) => {
    const _message = E34GEncoder.encoder({ command, args } as any);
    if (!_message) return;
    response[command as Namespace.ConfigKeys] = _message;
  });
  return response;
};

export const useE3Plus4G = () => {
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
      msg: Message<string, { check?: string; delay_before?: number }>
    ) => {
      const reader = await getReader(port);
      const { command, timeout, delay_before } = msg;
      if (delay_before) await sleep(delay_before);
      console.log("-------------------------");
      console.log("command", command);
      await writeToPort(port, command);
      const response = await readResponse(reader, timeout);
      console.log("response", response);
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
        { command: "IMEI", key: "imei", transform: E34GParser.imei },
        { command: "ICCID", key: "iccid", transform: E34GParser.iccid },
        { command: "ET", key: "firmware", transform: E34GParser.firmware },
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
            console.error("[ERROR] handleDetection use-e3-plus-4g", error);
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
        { command: "CHECK", key: "check" },
        { command: "CXIP", key: "cxip" },
        { command: "STATUS", key: "status" },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const { check, cxip, status } = await sendMultipleMessages({
              transport: port,
              messages,
            });
            if (!check || !cxip || !status) {
              console.error(
                "[ERROR] handleGetProfile use-e3-plus-4g",
                "CXIP ou CHECK ou STATUS não foram respondidos"
              );
              return { port };
            }
            const {
              data_transmission_off,
              data_transmission_on,
              apn,
              keep_alive,
              ...processed_check
            } = E34GParser.check(check) ?? {};
            const processed_status = E34GParser.status(status);
            const ip_primary = E34GParser.ip_primary(cxip);
            const ip_secondary = E34GParser.ip_secondary(cxip);
            const dns_primary = E34GParser.dns(cxip);
            const horimeter = processed_status?.HR
              ? E34GParser.horimeter(processed_status.HR)
              : undefined;
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
                },
                specific: {
                  ...processed_check,
                  horimeter,
                },
              },
              raw: [
                ["check", check],
                ["cxip", cxip],
                ["status", status],
              ],
            };
          } catch (error) {
            console.error("[ERROR] handleGetProfile use-e3-plus-4g", error);
            return { port };
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
            let applied_profile = {} as Namespace.Profile;
            const { check, status, cxip } = response;
            if (check && status && cxip) {
              const {
                data_transmission_off,
                data_transmission_on,
                apn,
                keep_alive,
                ...processed_check
              } = E34GParser.check(check) ?? {};
              const processed_status = E34GParser.status(status);
              const ip_primary = E34GParser.ip_primary(cxip);
              const ip_secondary = E34GParser.ip_secondary(cxip);
              const dns_primary = E34GParser.dns(cxip);
              const horimeter = processed_status?.HR
                ? E34GParser.horimeter(processed_status.HR)
                : undefined;
              applied_profile = {
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
              };
            }

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
              applied_profile,
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
      const messages = [
        {
          key: "autotest",
          command: "AUTOTEST",
          transform: E34GParser.auto_test,
          timeout: 25000,
        },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });

            const { autotest } = response;

            const analysis = {
              SIMHW: isIccid(autotest?.["IC"] ?? ""),
              GPS: autotest?.["GPS"] === "OK" ? true : false,
              IN1: autotest?.["IN1"] === "OK" ? true : false,
              IN2: autotest?.["IN2"] === "OK" ? true : false,
              OUT: autotest?.["OUT"] === "OK" ? true : false,
              ACELP: autotest?.["ACELP"] === "OK" ? true : false,
              VCC: autotest?.["VCC"] === "OK" ? true : false,
              CHARGER: autotest?.["CHARGER"] === "OK" ? true : false,
              MEM:
                autotest?.["ID_MEM"]?.length && autotest?.["ID_MEM"]?.length > 0
                  ? true
                  : false,
            };
            const status = Object.values(analysis).every(Boolean);
            const end_time = Date.now();
            return {
              port,
              response,
              messages,
              analysis,
              init_time,
              end_time,
              status,
            };
          } catch (error) {
            console.error("[ERROR] handleAutoTest e3-plus-4g", error);
            return { port };
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
        { command: "IMEI", key: "imei", transform: E34GParser.imei },
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
    handleGetProfile,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
    handleGetIdentification,
  };
};
