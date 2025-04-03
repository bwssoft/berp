import { useCallback } from "react";
import { E3Encoder, E3Parser } from "../../@backend/infra/protocol";
import { typedObjectEntries } from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";

type ConfigKeys = keyof IConfigurationProfile["config"];

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string
): Promise<string | undefined> => {
  const decoder = new TextDecoder();
  let buffer = "";
  let foundCommandResponse = false;
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
          if (line.includes(`SMS:${command}`)) {
            foundCommandResponse = true;
          } else if (foundCommandResponse) {
            return line;
          }
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
    const _message = E3Encoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useE3Plus = () => {
  const { ports, openPort, closePort, getReader, writeToPort, requestPort } =
    useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: openPort,
    closeTransport: closePort,
    sendMessage: async (port, message) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      await writeToPort(port, message);
      const response = await readResponse(reader, message);
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

  // functions to interact with E3 via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "IMEI", key: "imei", transform: E3Parser.imei },
        { message: "ICCID", key: "iccid", transform: E3Parser.iccid },
        { message: "ET", key: "firmware", transform: E3Parser.firmware },
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
            } = E3Parser.check(check) ?? {};
            const ip_primary = E3Parser.ip_primary(cxip);
            const ip_secondary = E3Parser.ip_secondary(cxip);
            const dns = E3Parser.dns(cxip);
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
                specific: processed_check,
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
        { key: "autotest", message: "AUTOTEST", timeout: 25000 },
      ];
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            const status = Object.values({}).every(Boolean);
            const end_time = Date.now();
            return {
              port,
              response,
              messages,
              init_time,
              end_time,
              analysis: {},
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
        console.error("[ERROR] handleIdentification", error);
        return { port };
      }
    },
    [sendMultipleMessages]
  );

  const handleGetIdentification = useCallback(
    async (port: ISerialPort) => {
      const messages = [
        { message: "IMEI", key: "imei", transform: E3Parser.imei },
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
    handleIdentification,
    handleGetProfile,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
    handleGetIdentification,
  };
};
