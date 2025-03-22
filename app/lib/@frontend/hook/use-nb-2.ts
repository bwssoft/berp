import { useCallback } from "react";
import {
  E34GEncoder,
  E34GParser,
  NB2Parser,
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
  const optional_functions_to_remove = profile.optional_functions
    ? Object.entries(profile.optional_functions)
        .filter(([_, value]) => value === false)
        .map(([key]) => key)
    : [];
  Object.entries(profile.config).forEach(([message, args]) => {
    if (optional_functions_to_remove.includes(message)) return;
    const _message = E34GEncoder.encoder({ command: message, args } as any);
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
        bufferSize: 1000000,
      });
    },
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
      delayBetweenMessages: 200,
      maxRetriesPerMessage: 3,
      maxOverallRetries: 2,
    },
  });

  // functions to interact with E34G via serial port
  const handleIdentificationProcess = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        { message: "RIMEI\r\n", key: "imei", transform: NB2Parser.imei },
        { message: "ICCID\r\n", key: "iccid", transform: NB2Parser.iccid },
        { message: "RINS\r\n", key: "serial", transform: NB2Parser.serial },
        {
          message: "RINS\r\n",
          key: "firmware",
          transform: () => "firmware#00",
        },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            await sleep(1000);
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return { port, response };
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
        { message: "\r\n", key: "odometer", transform: NB2Parser.odometer },
        {
          message: "\r\n",
          key: "data_transmission_on",
          transform: NB2Parser.data_transmission_on,
        },
        {
          message: "\r\n",
          key: "data_transmission_off",
          transform: NB2Parser.data_transmission_off,
        },
        { message: "\r\n", key: "sleep", transform: NB2Parser.sleep },
        { message: "\r\n", key: "keep_alive", transform: NB2Parser.keep_alive },
        { message: "\r\n", key: "ip_primary", transform: NB2Parser.ip_primary },
        {
          message: "\r\n",
          key: "ip_secondary",
          transform: NB2Parser.ip_secondary,
        },
        {
          message: "\r\n",
          key: "dns_primary",
          transform: NB2Parser.dns_primary,
        },
        {
          message: "\r\n",
          key: "dns_secondary",
          transform: NB2Parser.dns_secondary,
        },
        { message: "\r\n", key: "apn", transform: NB2Parser.apn },
        {
          message: "\r\n",
          key: "first_voltage",
          transform: NB2Parser.first_voltage,
        },
        {
          message: "\r\n",
          key: "second_voltage",
          transform: NB2Parser.second_voltage,
        },
        { message: "\r\n", key: "angle", transform: NB2Parser.angle },
        { message: "\r\n", key: "speed", transform: NB2Parser.speed },
        {
          message: "\r\n",
          key: "accelerometer_sensitivity_on",
          transform: NB2Parser.accelerometer_sensitivity_on,
        },
        {
          message: "\r\n",
          key: "accelerometer_sensitivity_off",
          transform: NB2Parser.accelerometer_sensitivity_off,
        },
        {
          message: "\r\n",
          key: "accelerometer_sensitivity_violated",
          transform: NB2Parser.accelerometer_sensitivity_violated,
        },
        {
          message: "\r\n",
          key: "maximum_acceleration",
          transform: NB2Parser.maximum_acceleration,
        },
        {
          message: "\r\n",
          key: "maximum_deceleration",
          transform: NB2Parser.maximum_deceleration,
        },
        { message: "\r\n", key: "input_1", transform: NB2Parser.input_1 },
        { message: "\r\n", key: "input_2", transform: NB2Parser.input_2 },
        { message: "\r\n", key: "input_3", transform: NB2Parser.input_3 },
        { message: "\r\n", key: "input_4", transform: NB2Parser.input_4 },
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
                  ip_primary,
                  ip_secondary,
                  data_transmission_off,
                  data_transmission_on,
                  dns_primary,
                  dns_secondary,
                  apn,
                  keep_alive,
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
          message: "AUTOTEST\r\n",
          transform: NB2Parser.auto_test,
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
              ACELC: (autotest?.["ACELC"] ?? "").length > 0 ? true : false,
              ACELP: autotest?.["ACELP"] === "OK" ? true : false,
              BATT_VOLT: !isNaN(Number(autotest?.["BATT_VOLT"] ?? NaN)),
              CHARGER: autotest?.["CHARGER"] === "OK" ? true : false,
              FW: (autotest?.["FW"] ?? "").length > 0 ? true : false,
              GPS: autotest?.["GPS"] === "OK" ? true : false,
              GPSf: autotest?.["GPSf"] === "OK" ? true : false,
              IC: isIccid(autotest?.["IC"] ?? ""),
              ID_ACEL: (autotest?.["ID_ACEL"] ?? "").length > 0 ? true : false,
              ID_MEM: (autotest?.["ID_MEM"] ?? "").length > 0 ? true : false,
              IM: isImei(autotest?.["IM"] ?? ""),
              IN1: autotest?.["IN1"] === "OK" ? true : false,
              IN2: autotest?.["IN2"] === "OK" ? true : false,
              MDM: autotest?.["MDM"] === "OK" ? true : false,
              OUT: autotest?.["OUT"] === "OK" ? true : false,
              RSI: autotest?.["RSI"] === "OK" ? true : false,
              SN: (autotest?.["SN"] ?? "").length > 0 ? true : false,
              VCC: !isNaN(Number(autotest?.["VCC"] ?? NaN)),
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
    async (port: ISerialPort, serial: string) => {
      const imei = await handleGetRandomImei();
      const messages = [
        {
          key: "serial",
          message: `WINS=${serial}\r\n`,
        },
        {
          key: "imei",
          message: `WIMEI=${imei}\r\n`,
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
        { message: "RINS\r\n", key: "serial", transform: NB2Parser.serial },
        { message: "RIMEI\r\n", key: "imei", transform: NB2Parser.imei },
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
