import { useCallback } from "react";
import { LORA, LORAParser, LORAEncoder } from "../../@backend/infra/protocol";
import { sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { IConfigurationProfile } from "../../@backend/domain";
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

      let lines = buffer.split("\r");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.length > 0 && line.includes(command.replace("\r", ""))) {
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
    const _message = LORAEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as ConfigKeys] = _message;
  });
  return response;
};

export const useLora = () => {
  const { ports, openPort, closePort, getReader, writeToPort, requestPort } =
    useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: async (transport) => {
      await openPort(transport, {
        baudRate: 115200,
        stopBits: 1,
      });
    },
    closeTransport: closePort,
    sendMessage: async (port, msg: Message<any, { check?: string }>) => {
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
      delayBetweenMessages: 100,
      maxRetriesPerMessage: 3,
      maxOverallRetries: 2,
    },
  });

  // functions to interact with E34G via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        {
          key: "serial",
          command: `RINS\r`,
          transform: LORAParser.serial,
        },
        {
          command: "RFW\r",
          key: "firmware",
          transform: LORAParser.firmware,
        },
        {
          key: "timestamp",
          command: `RTK\r`,
          transform: LORAParser.timestamp,
        },
        {
          key: "device_address",
          command: `RDA\r`,
          transform: LORAParser.device_address,
        },
        {
          key: "device_eui",
          command: `RDE\r`,
          transform: LORAParser.device_eui,
        },
        {
          key: "application_eui",
          command: `RAP\r`,
          transform: LORAParser.application_eui,
        },
        {
          key: "application_key",
          command: `RAK\r`,
          transform: LORAParser.application_key,
        },
        {
          key: "application_session_key",
          command: `RASK\r`,
          transform: LORAParser.application_session_key,
        },
        {
          key: "network_session_key",
          command: `RNK\r`,
          transform: LORAParser.network_session_key,
        },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const { serial, firmware, ...lora_keys } =
              await sendMultipleMessages({
                transport: port,
                messages,
              });
            const response = { serial, firmware, lora_keys };
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
        { command: "RODM\r", key: "odometer", transform: LORAParser.odometer },
        {
          command: "RCW\r",
          key: "data_transmission_sleep",
          transform: LORAParser.data_transmission_sleep,
        },

        {
          command: "RIG1\r",
          key: "virtual_ignition_12v",
          transform: LORAParser.virtual_ignition_12v,
        },
        {
          command: "RIG2\r",
          key: "virtual_ignition_24v",
          transform: LORAParser.virtual_ignition_24v,
        },

        { command: "RFH\r", key: "heading", transform: LORAParser.heading },
        {
          command: "RFHV\r",
          key: "heading_event_mode",
          transform: LORAParser.heading_event_mode,
        },
        {
          command: "RFA\r",
          key: "heading_detection_angle",
          transform: LORAParser.heading_detection_angle,
        },

        {
          command: "RFV\r",
          key: "speed_alert_threshold",
          transform: LORAParser.speed_alert_threshold,
        },
        {
          command: "RFTON\r",
          key: "accel_threshold_for_ignition_on",
          transform: LORAParser.accel_threshold_for_ignition_on,
        },
        {
          command: "RFTOF\r",
          key: "accel_threshold_for_ignition_off",
          transform: LORAParser.accel_threshold_for_ignition_off,
        },
        {
          command: "RFAV\r",
          key: "accel_threshold_for_movement",
          transform: LORAParser.accel_threshold_for_movement,
        },
        {
          command: "RFMA\r",
          key: "harsh_acceleration_threshold",
          transform: LORAParser.harsh_acceleration_threshold,
        },
        {
          command: "RFMD\r",
          key: "harsh_braking_threshold",
          transform: LORAParser.harsh_braking_threshold,
        },

        {
          command: "RWTR\r",
          key: "data_transmission_position",
          transform: LORAParser.data_transmission_position,
        },
        {
          command: "RLED\r",
          key: "led_lighting",
          transform: LORAParser.led_lighting,
        },

        {
          command: "RLTO\r",
          key: "p2p_mode_duration",
          transform: LORAParser.p2p_mode_duration,
        },
        {
          command: "WWTO\r",
          key: "lorawan_mode_duration",
          transform: LORAParser.lorawan_mode_duration,
        },

        { command: "RIN1\r", key: "input_1", transform: LORAParser.input_1 },
        { command: "RIN2\r", key: "input_2", transform: LORAParser.input_2 },
        { command: "RIN3\r", key: "input_3", transform: LORAParser.input_3 },
        { command: "RIN4\r", key: "input_4", transform: LORAParser.input_4 },
        { command: "RIN5\r", key: "input_5", transform: LORAParser.input_5 },
        { command: "RIN6\r", key: "input_6", transform: LORAParser.input_6 },

        {
          command: "RC\r",
          key: "full_configuration_table",
          transform: LORAParser.full_configuration_table,
        },
        {
          command: "RFIFO\r",
          key: "fifo_send_and_hold_times",
          transform: LORAParser.fifo_send_and_hold_times,
        },

        {
          command: "REWTR\r",
          key: "lorawan_data_transmission_event",
          transform: LORAParser.lorawan_data_transmission_event,
        },
        {
          command: "RELTR\r",
          key: "p2p_data_transmission_event",
          transform: LORAParser.p2p_data_transmission_event,
        },

        {
          command: "RTS\r",
          key: "data_transmission_status",
          transform: LORAParser.data_transmission_status,
        },
        {
          command: "RF\r",
          key: "full_functionality_table",
          transform: LORAParser.full_functionality_table,
        },

        {
          command: "RACT\r",
          key: "activation_type",
          transform: LORAParser.activation_type,
        },
        {
          command: "RMC\r",
          key: "mcu_configuration",
          transform: LORAParser.mcu_configuration,
        },

        {
          command: "ROUT\r",
          key: "output_table",
          transform: LORAParser.output_table,
        },
      ] as const;

      return await Promise.all(
        ports.map(async (port) => {
          try {
            const specific = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return {
              port,
              config: {
                general: {},
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
            response: {} as Record<string, LORA.AutoTest | string | undefined>,
            messages: [
              { key: "start", command: "START\r" },
              { key: "autotest_1", command: "AUTOTEST\r" },
              { key: "autotest_2", command: "AUTOTEST\r" },
              { key: "autotest_3", command: "AUTOTEST\r" },
              { key: "autotest_4", command: "AUTOTEST\r" },
              { key: "autotest_5", command: "AUTOTEST\r" },
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
              messages: [{ key: "start", command: "START\r" }] as const,
            });
            resultTemplate.response["start"] = startResponse.start;

            // 2. Configuração do loop de AUTOTEST
            const autotestTimeout = 25000; // 25s timeout total
            const startTime = Date.now();
            let remainingAttempts = 5;

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
                      command: "AUTOTEST\r",
                      transform: LORAParser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const ACELID = Number(autotest["ACELID"]);
                const ADMAIN = Number(autotest["ADMAIN"]);
                const ADBACK = Number(autotest["ADBACK"]);
                const ADNTC = Number(autotest["ADNTC"]);

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_LORA",
                  SN: typeof autotest["SN"] === "string",
                  FW: typeof autotest["FW"] === "string",
                  ACELID: !isNaN(ACELID),
                  ADMAIN: !isNaN(ADMAIN),
                  ADBACK: !isNaN(ADBACK),
                  ADNTC: !isNaN(ADNTC) && ADNTC !== 255,
                  ACELCOM: autotest["ACELCOM"] === "OK",
                  IN1: autotest["IN1"] === "OK",
                  IN2: autotest["IN2"] === "OK",
                  OUT1: autotest["OUT1"] === "OK",
                  CHARGER: autotest["CHARGER"] === "OK",
                  GPSCOM: autotest["GPSCOM"] === "OK",
                  GPSVCC: autotest["GPSVCC"] === "OK",
                  GPSRST: autotest["GPSRST"] === "OK",
                };

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
      const timestamp = (getDayZeroTimestamp() / 1000)
        .toString(16)
        .toUpperCase();

      const writeMessages = [
        {
          key: "serial",
          command: `WINS=${serial}\r`,
          check: "WINS",
        },
        {
          key: "timestamp",
          command: `WTK=${timestamp}\r`,
          check: "WTK",
        },
      ] as const;

      const readMessages = [
        {
          key: "serial",
          command: `RINS\r`,
          transform: LORAParser.serial,
        },
        {
          key: "timestamp",
          command: `RTK\r`,
          transform: LORAParser.timestamp,
        },
        {
          key: "device_address",
          command: `RDA\r`,
          transform: LORAParser.device_address,
        },
        {
          key: "device_eui",
          command: `RDE\r`,
          transform: LORAParser.device_eui,
        },
        {
          key: "application_eui",
          command: `RAP\r`,
          transform: LORAParser.application_eui,
        },
        {
          key: "application_key",
          command: `RAK\r`,
          transform: LORAParser.application_key,
        },
        {
          key: "application_session_key",
          command: `RASK\r`,
          transform: LORAParser.application_session_key,
        },
        {
          key: "network_session_key",
          command: `RNK\r`,
          transform: LORAParser.network_session_key,
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
          !readResponse.serial ||
          !readResponse.timestamp ||
          !readResponse.device_address ||
          !readResponse.device_eui ||
          !readResponse.application_eui ||
          !readResponse.application_key ||
          !readResponse.application_session_key ||
          !readResponse.network_session_key
        ) {
          return { ok: false, port, error: "Serial inválido" };
        }

        const status =
          serial === readResponse.serial &&
          timestamp === readResponse.timestamp;

        const end_time = Date.now();

        return {
          ok: true,
          port,
          response: writeResponse,
          messages: writeMessages,
          init_time,
          end_time,
          status,
          equipment: {
            serial: readResponse.serial,
            lora_keys: {
              timestamp: readResponse.timestamp,
              device_address: readResponse.device_address,
              device_eui: readResponse.device_eui,
              application_eui: readResponse.application_eui,
              application_key: readResponse.application_key,
              application_session_key: readResponse.application_session_key,
              network_session_key: readResponse.network_session_key,
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

  const isIdentified = (input: { serial?: string; firmware?: string }) => {
    const { serial, firmware } = input;
    const identified = [serial, firmware];
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
