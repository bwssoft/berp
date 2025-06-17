import { useCallback, useEffect, useRef, useState } from "react";
import { E34GEncoder, E34GParser } from "../../@backend/infra/protocol";
import { isIccid, typedObjectEntries } from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";

type ConfigKeys = keyof IConfigurationProfile["config"];

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
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
): Record<ConfigKeys, string> => {
  const response = {} as Record<ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([message, args]) => {
    const _message = E34GEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
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
    sendMessage: async (port, msg) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout } = msg;
      await writeToPort(port, command);
      const response = await readResponse(reader, timeout);
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
            const horimeter = E34GParser.horimeter(processed_status.HR);
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
            console.error("[ERROR] handleAutoTest", error);
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
        console.error("[ERROR] handleIdentification", error);
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
        console.error("[ERROR] handleGetIdentification", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );

  const isIdentified = (input: {
    imei?: string;
    iccid?: string;
    firmware?: string;
  }) => {
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
