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
  Object.entries(profile.config).forEach(([message, args]) => {
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
    openTransport: openPort,
    closeTransport: closePort,
    sendMessage: async (port, message, timeout) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      await writeToPort(port, message);
      const response = await readResponse(reader, timeout);
      await reader.cancel();
      reader.releaseLock();
      return response;
    },
    options: {
      delayBetweenMessages: 100,
      maxRetriesPerMessage: 3,
      maxOverallRetries: 2,
    },
  });

  // functions to interact with E34G via serial port
  const handleIdentificationProcess = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "IMEI", key: "imei", transform: E34GParser.imei },
        { message: "ICCID", key: "iccid", transform: E34GParser.iccid },
        { message: "ET", key: "firmware", transform: E34GParser.firmware },
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
            console.error("[ERROR] handleIdentificationProcess", error);
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
        { message: "CHECK", key: "check" },
        { message: "CXIP", key: "cxip" },
        { message: "STATUS", key: "status" },
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
            const dns = E34GParser.dns(cxip);
            const horimeter = E34GParser.horimeter(processed_status.HR);
            return {
              port,
              config: {
                general: {
                  ip_primary,
                  ip_secondary,
                  data_transmission_off,
                  data_transmission_on,
                  dns_primary: dns,
                  apn,
                  keep_alive,
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
  const handleConfigurationProcess = useCallback(
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
            return {
              port,
              response,
              messages: configurationCommands,
              init_time,
              end_time,
            };
          } catch (error) {
            console.error("[ERROR] handleConfigurationProcess", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleAutoTestProcess = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        {
          key: "autotest",
          message: "AUTOTEST",
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
            const end_time = Date.now();
            return {
              port,
              response,
              messages,
              analysis,
              init_time,
              end_time,
            };
          } catch (error) {
            console.error("[ERROR] handleAutoTestProcess", error);
            return { port };
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleDeviceIdentificationProcess = useCallback(
    async (port: ISerialPort, identifier: string) => {
      const messages = [
        {
          key: "imei",
          message: `13041SETSN,${identifier}`,
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
        console.error("[ERROR] handleDeviceIdentificationProcess", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );
  const handleGetIdentification = useCallback(
    async (port: ISerialPort) => {
      const messages = [
        { message: "IMEI", key: "imei", transform: E34GParser.imei },
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

  return {
    ports,
    handleIdentificationProcess,
    handleGetProfile,
    handleConfigurationProcess,
    requestPort,
    handleAutoTestProcess,
    handleDeviceIdentificationProcess,
    handleGetIdentification,
  };
};
