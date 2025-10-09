import { useCallback } from "react";
import { E3Parser } from "../../@backend/infra/protocol/parser/E3";
import { E3Encoder } from "../../@backend/infra/protocol/encoder/E3";
import { typedObjectEntries } from "../../util";
import { useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Device,
  E3PlusConfig,
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

  export type Profile = IConfigurationProfile<E3PlusConfig>["config"];

  export type ConfigKeys =
    | keyof NonNullable<Profile["general"]>
    | keyof NonNullable<Profile["specific"]>;
}

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string,
  timeout: number = 500
): Promise<string | undefined> => {
  const decoder = new TextDecoder();
  let buffer = "";
  let foundCommandResponse = false;
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
): Record<Namespace.ConfigKeys, string> => {
  const response = {} as Record<Namespace.ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([message, args]) => {
    const _message = E3Encoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as Namespace.ConfigKeys] = _message;
  });
  return response;
};

export const useE3Plus = () => {
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

  // functions to interact with E3 via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { command: "IMEI", key: "imei", transform: E3Parser.imei },
        { command: "ICCID", key: "iccid", transform: E3Parser.iccid },
        { command: "ET", key: "firmware", transform: E3Parser.firmware },
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

            const { check, cxip } = response;
            const {
              data_transmission_off,
              data_transmission_on,
              apn,
              keep_alive,
              ...processed_check
            } = E3Parser.check(check) ?? {};
            const ip_primary = E3Parser.ip_primary(cxip);
            const ip_secondary = E3Parser.ip_secondary(cxip);
            const dns_primary = E3Parser.dns(cxip);
            return {
              port,
              equipment,
              config: {
                check: undefined,
                general: {
                  data_transmission_on,
                  data_transmission_off,
                  ip_primary,
                  ip_secondary,
                  apn,
                  keep_alive,
                  dns_primary,
                },
                specific: processed_check,
              },
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
            };
          } catch (error) {
            console.error("[ERROR] handleGetConfig", error);
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
            const { check, cxip } = response;
            const {
              data_transmission_off,
              data_transmission_on,
              apn,
              keep_alive,
              ...processed_check
            } = E3Parser.check(check) ?? {};
            const ip_primary = E3Parser.ip_primary(cxip);
            const ip_secondary = E3Parser.ip_secondary(cxip);
            const dns_primary = E3Parser.dns(cxip);
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
                specific: processed_check,
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
      const messages = [
        { key: "autotest", command: "AUTOTEST", timeout: 25000 },
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
    async (detected: Namespace.Detected, id: string) => {
      const { port, equipment } = detected;

      try {
        const messages = [
          {
            key: "write_imei",
            command: `13041SETSN,${id}`,
          },
          {
            key: "read_imei",
            command: `IMEI`,
            delay_before: 2000,
          },
        ] as const;

        const init_time = Date.now();
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });

        const imei = E3Parser.imei(response.read_imei);

        const status = id === imei;

        const end_time = Date.now();
        return {
          port,
          init_time,
          end_time,
          status,
          messages: messages.map(({ key, command }) => ({
            key,
            request: command,
            response: response[key],
          })),
          equipment_before: {
            serial: equipment.serial,
            imei: equipment.imei,
          },
          equipment_after: {
            serial: imei,
            imei,
          },
        };
      } catch (error) {}
    },
    [sendMultipleMessages]
  );

  const handleGetIdentification = useCallback(
    async (port: ISerialPort) => {
      const messages = [
        { command: "IMEI", key: "imei", transform: E3Parser.imei },
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
  const handleFirmwareUpdate = useCallback(
    async (detected: Namespace.Detected[]) => {
      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const messages = [
              {
                key: "update_firmware",
                command: `UPFW\r\n`,
              },
            ] as const;

            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            const status =
              response.update_firmware && response.update_firmware.length > 0;

            const end_time = Date.now();
            return {
              port,
              init_time,
              end_time,
              status,
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
              equipment: {
                serial: equipment.serial,
                imei: equipment.imei,
                firmware: equipment.firmware,
              },
            };
          } catch (error) {
            const message = `[(${new Date().toLocaleString()}) ERROR IN E3+ FIRMWARE UPDATE]`;
            console.error(message, error);
            throw new Error(message);
          }
        })
      );
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
    handleFirmwareUpdate,
  };
};
