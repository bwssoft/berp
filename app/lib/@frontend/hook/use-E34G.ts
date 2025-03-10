import { useCallback, useEffect, useRef, useState } from "react";
import { E34GEncoder, E34GParser } from "../../@backend/infra/protocol";
import { typedObjectEntries } from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";

type ConfigKeys = keyof IConfigurationProfile["config"];

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>
): Promise<string | undefined> => {
  const decoder = new TextDecoder();
  let buffer = "";
  const timeoutPromise = new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), 500)
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
  const optional_functions_to_remove = profile.optional_functions
    ? Object.entries(profile.optional_functions)
        .filter(([_, value]) => value === false)
        .map(([key]) => key)
    : [];
  Object.entries(profile.config).forEach(([message, args]) => {
    if (optional_functions_to_remove.includes(message)) return;
    const _message = E34GEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = (
      Array.isArray(_message) ? _message[0] : _message
    ) as string;
  });
  return response;
};

export const useE34G = () => {
  const { ports, openPort, closePort, getReader, writeToPort } = useSerialPort(
    {}
  );

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: openPort,
    closeTransport: closePort,
    sendMessage: async (port, message) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      await writeToPort(port, message);
      const response = await readResponse(reader);
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
        { message: "ET", key: "et", transform: E34GParser.et },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return response;
          } catch (error) {
            console.error("[ERROR] handleIdentificationProcess", error);
          }
        })
      );
    },
    [sendMultipleMessages]
  );
  const handleGetProfile = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "CHECK", key: "check", transform: E34GParser.check },
        {
          message: "CXIP",
          key: "cxip",
          transform: (raw: string) => ({
            ip_primary: E34GParser.ip_primary(raw),
            ip_secondary: E34GParser.ip_secondary(raw),
            dns: E34GParser.dns(raw),
          }),
        },
        { message: "STATUS", key: "status", transform: E34GParser.status },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const { check, cxip, status } = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return {
              ...check,
              ...cxip,
              horimeter: E34GParser.horimeter(status?.["HR"] ?? ""),
            };
          } catch (error) {
            console.error("[ERROR] handleGetProfile", error);
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
      const commands = generateMessages(configuration_profile);
      const messages = typedObjectEntries(commands).map(([key, message]) => ({
        key,
        message,
      }));
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return response;
          } catch (error) {
            console.error("[ERROR] handleConfigurationProcess", error);
          }
        })
      );
    },
    [sendMultipleMessages]
  );

  return {
    ports,
    handleIdentificationProcess,
    handleGetProfile,
    handleConfigurationProcess,
  };
};
