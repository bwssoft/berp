import { useCallback } from "react";
import {
  BwsLora,
  BwsLoraParser,
  BwsLoraEncoder,
} from "../../@backend/infra/protocol";
import { sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Device,
  IConfigurationProfile,
  BwsLoraConfig,
} from "../../@backend/domain";
import { getDayZeroTimestamp } from "../../util/get-day-zero-timestamp";
import { genKeyLorawan } from "../../util/generate-key-lora-wan";

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

  export type Profile = IConfigurationProfile<BwsLoraConfig>["config"];

  export type ConfigKeys = keyof NonNullable<Profile["specific"]>;
}

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

      buffer += decoder.decode(value);

      console.log("[RAW DATA]", buffer);

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
): Record<Namespace.ConfigKeys, string> => {
  const response = {} as Record<Namespace.ConfigKeys, string>;
  Object.entries({
    ...profile.config.general,
    ...profile.config.specific,
  }).forEach(([message, args]) => {
    const _message = BwsLoraEncoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as Namespace.ConfigKeys] = _message;
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
    sendMessage: async (port, msg: Message<any, { delay_before?: number }>) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout, delay_before } = msg;
      if (delay_before) await sleep(delay_before);
      console.log("-------------------------");
      console.log("[MESSAGE SENT]", command);
      await writeToPort(port, command);
      const response = await readResponse(reader, command, timeout);
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

  // functions to interact with E34G via serial port
  const handleDetection = useCallback(
    async (ports: ISerialPort[]) => {
      const messages = [
        {
          key: "serial",
          command: `RINS\r`,
          transform: BwsLoraParser.serial,
        },
        {
          command: "RFW\r",
          key: "firmware",
          transform: BwsLoraParser.firmware,
        },
        {
          key: "timestamp",
          command: `RTK\r`,
          transform: BwsLoraParser.timestamp,
        },
        {
          key: "device_address",
          command: `RDA\r`,
          transform: BwsLoraParser.device_address,
        },
        {
          key: "device_eui",
          command: `RDE\r`,
          transform: BwsLoraParser.device_eui,
        },
        {
          key: "application_eui",
          command: `RAP\r`,
          transform: BwsLoraParser.application_eui,
        },
        {
          key: "application_key",
          command: `RAK\r`,
          transform: BwsLoraParser.application_key,
        },
        {
          key: "application_session_key",
          command: `RASK\r`,
          transform: BwsLoraParser.application_session_key,
        },
        {
          key: "network_session_key",
          command: `RNK\r`,
          transform: BwsLoraParser.network_session_key,
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
  const handleGetConfig = useCallback(
    async (detected: Namespace.Detected[]) => {
      const messages = [
        { command: "RODM\r", key: "odometer", delay_before: 1000 },
        {
          command: "RCW\r",
          key: "data_transmission_sleep",
        },
        {
          command: "RIG1\r",
          key: "virtual_ignition_12v",
        },
        {
          command: "RIG2\r",
          key: "virtual_ignition_24v",
        },
        { command: "RFH\r", key: "heading" },
        {
          command: "RFHV\r",
          key: "heading_event_mode",
        },
        {
          command: "RFA\r",
          key: "heading_detection_angle",
        },
        {
          command: "RFV\r",
          key: "speed_alert_threshold",
        },
        {
          command: "RFTON\r",
          key: "accel_threshold_for_ignition_on",
        },
        {
          command: "RFTOF\r",
          key: "accel_threshold_for_ignition_off",
        },
        {
          command: "RFAV\r",
          key: "accel_threshold_for_movement",
        },
        {
          command: "RFMA\r",
          key: "harsh_acceleration_threshold",
        },
        {
          command: "RFMD\r",
          key: "harsh_braking_threshold",
        },
        {
          command: "RWTR\r",
          key: "data_transmission_position",
        },
        {
          command: "RLED\r",
          key: "led_lighting",
        },
        {
          command: "RLTO\r",
          key: "p2p_mode_duration",
        },
        {
          command: "RWTO\r",
          key: "lorawan_mode_duration",
        },
        { command: "RIN1\r", key: "input_1" },
        { command: "RIN2\r", key: "input_2" },
        { command: "RIN3\r", key: "input_3" },
        { command: "RIN4\r", key: "input_4" },
        { command: "RIN5\r", key: "input_5" },
        { command: "RIN6\r", key: "input_6" },
        {
          command: "RC\r",
          key: "full_configuration_table",
        },
        {
          command: "RFIFO\r",
          key: "fifo_send_and_hold_times",
        },
        {
          command: "REWTR\r",
          key: "lorawan_data_transmission_event",
        },
        {
          command: "RELTR\r",
          key: "p2p_data_transmission_event",
        },
        {
          command: "RTS\r",
          key: "data_transmission_status",
        },
        {
          command: "RF\r",
          key: "full_functionality_table",
        },
        {
          command: "RACT\r",
          key: "activation_type",
        },
        {
          command: "RMC\r",
          key: "mcu_configuration",
        },
        {
          command: "ROUT\r",
          key: "output_table",
        },
      ] as const;

      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            return {
              port,
              equipment,
              config: {
                general: {},
                specific: {
                  odometer: BwsLoraParser.odometer(response.odometer),
                  data_transmission_sleep:
                    BwsLoraParser.data_transmission_sleep(
                      response.data_transmission_sleep
                    ),
                  virtual_ignition_12v: BwsLoraParser.virtual_ignition_12v(
                    response.virtual_ignition_12v
                  ),
                  virtual_ignition_24v: BwsLoraParser.virtual_ignition_24v(
                    response.virtual_ignition_24v
                  ),
                  heading: BwsLoraParser.heading(response.heading),
                  heading_event_mode: BwsLoraParser.heading_event_mode(
                    response.heading_event_mode
                  ),
                  heading_detection_angle:
                    BwsLoraParser.heading_detection_angle(
                      response.heading_detection_angle
                    ),
                  speed_alert_threshold: BwsLoraParser.speed_alert_threshold(
                    response.speed_alert_threshold
                  ),
                  accel_threshold_for_ignition_on:
                    BwsLoraParser.accel_threshold_for_ignition_on(
                      response.accel_threshold_for_ignition_on
                    ),
                  accel_threshold_for_ignition_off:
                    BwsLoraParser.accel_threshold_for_ignition_off(
                      response.accel_threshold_for_ignition_off
                    ),
                  accel_threshold_for_movement:
                    BwsLoraParser.accel_threshold_for_movement(
                      response.accel_threshold_for_movement
                    ),
                  harsh_acceleration_threshold:
                    BwsLoraParser.harsh_acceleration_threshold(
                      response.harsh_acceleration_threshold
                    ),
                  harsh_braking_threshold:
                    BwsLoraParser.harsh_braking_threshold(
                      response.harsh_braking_threshold
                    ),
                  data_transmission_position:
                    BwsLoraParser.data_transmission_position(
                      response.data_transmission_position
                    ),
                  led_lighting: BwsLoraParser.led_lighting(
                    response.led_lighting
                  ),
                  p2p_mode_duration: BwsLoraParser.p2p_mode_duration(
                    response.p2p_mode_duration
                  ),
                  lorawan_mode_duration: BwsLoraParser.lorawan_mode_duration(
                    response.lorawan_mode_duration
                  ),
                  input_1: BwsLoraParser.input_1(response.input_1),
                  input_2: BwsLoraParser.input_2(response.input_2),
                  input_3: BwsLoraParser.input_3(response.input_3),
                  input_4: BwsLoraParser.input_4(response.input_4),
                  input_5: BwsLoraParser.input_5(response.input_5),
                  input_6: BwsLoraParser.input_6(response.input_6),
                  full_configuration_table:
                    BwsLoraParser.full_configuration_table(
                      response.full_configuration_table
                    ),
                  fifo_send_and_hold_times:
                    BwsLoraParser.fifo_send_and_hold_times(
                      response.fifo_send_and_hold_times
                    ),
                  lorawan_data_transmission_event:
                    BwsLoraParser.lorawan_data_transmission_event(
                      response.lorawan_data_transmission_event
                    ),
                  p2p_data_transmission_event:
                    BwsLoraParser.p2p_data_transmission_event(
                      response.p2p_data_transmission_event
                    ),
                  data_transmission_status:
                    BwsLoraParser.data_transmission_status(
                      response.data_transmission_status
                    ),
                  full_functionality_table:
                    BwsLoraParser.full_functionality_table(
                      response.full_functionality_table
                    ),
                  activation_type: BwsLoraParser.activation_type(
                    response.activation_type
                  ),
                  mcu_configuration: BwsLoraParser.mcu_configuration(
                    response.mcu_configuration
                  ),
                  output_table: BwsLoraParser.output_table(
                    response.output_table
                  ),
                },
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
        { command: "RODM\r", key: "read_odometer", delay_before: 1000 },
        {
          command: "RCW\r",
          key: "read_data_transmission_sleep",
        },
        {
          command: "RIG1\r",
          key: "read_virtual_ignition_12v",
        },
        {
          command: "RIG2\r",
          key: "read_virtual_ignition_24v",
        },
        { command: "RFH\r", key: "read_heading" },
        {
          command: "RFHV\r",
          key: "read_heading_event_mode",
        },
        {
          command: "RFA\r",
          key: "read_heading_detection_angle",
        },
        {
          command: "RFV\r",
          key: "read_speed_alert_threshold",
        },
        {
          command: "RFTON\r",
          key: "read_accel_threshold_for_ignition_on",
        },
        {
          command: "RFTOF\r",
          key: "read_accel_threshold_for_ignition_off",
        },
        {
          command: "RFAV\r",
          key: "read_accel_threshold_for_movement",
        },
        {
          command: "RFMA\r",
          key: "read_harsh_acceleration_threshold",
        },
        {
          command: "RFMD\r",
          key: "read_harsh_braking_threshold",
        },
        {
          command: "RWTR\r",
          key: "read_data_transmission_position",
        },
        {
          command: "RLED\r",
          key: "read_led_lighting",
        },
        {
          command: "RLTO\r",
          key: "read_p2p_mode_duration",
        },
        {
          command: "RWTO\r",
          key: "read_lorawan_mode_duration",
        },
        { command: "RIN1\r", key: "read_input_1" },
        { command: "RIN2\r", key: "read_input_2" },
        { command: "RIN3\r", key: "read_input_3" },
        { command: "RIN4\r", key: "read_input_4" },
        { command: "RIN5\r", key: "read_input_5" },
        { command: "RIN6\r", key: "read_input_6" },
        {
          command: "RC\r",
          key: "read_full_configuration_table",
        },
        {
          command: "RFIFO\r",
          key: "read_fifo_send_and_hold_times",
        },
        {
          command: "REWTR\r",
          key: "read_lorawan_data_transmission_event",
        },
        {
          command: "RELTR\r",
          key: "read_p2p_data_transmission_event",
        },
        {
          command: "RTS\r",
          key: "read_data_transmission_status",
        },
        {
          command: "RF\r",
          key: "read_full_functionality_table",
        },
        {
          command: "RACT\r",
          key: "read_activation_type",
        },
        {
          command: "RMC\r",
          key: "read_mcu_configuration",
        },
        {
          command: "ROUT\r",
          key: "read_output_table",
        },
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
            const {
              read_odometer,
              read_data_transmission_sleep,
              read_virtual_ignition_12v,
              read_virtual_ignition_24v,
              read_heading,
              read_heading_event_mode,
              read_heading_detection_angle,
              read_speed_alert_threshold,
              read_accel_threshold_for_ignition_on,
              read_accel_threshold_for_ignition_off,
              read_accel_threshold_for_movement,
              read_harsh_acceleration_threshold,
              read_harsh_braking_threshold,
              read_data_transmission_position,
              read_led_lighting,
              read_p2p_mode_duration,
              read_lorawan_mode_duration,
              read_input_1,
              read_input_2,
              read_input_3,
              read_input_4,
              read_input_5,
              read_input_6,
              read_full_configuration_table,
              read_fifo_send_and_hold_times,
              read_lorawan_data_transmission_event,
              read_p2p_data_transmission_event,
              read_data_transmission_status,
              read_full_functionality_table,
              read_activation_type,
              read_mcu_configuration,
              read_output_table,
              ...configuration
            } = response;
            const configurationEntries = Object.entries(configuration ?? {});
            const status =
              configurationEntries.length > 0 &&
              configurationEntries.every(
                ([_, value]) => typeof value !== "undefined"
              );

            return {
              equipment,
              port,
              init_time,
              end_time,
              status,
              applied_profile: {
                specific: {
                  odometer: BwsLoraParser.odometer(read_odometer),
                  data_transmission_sleep:
                    BwsLoraParser.data_transmission_sleep(
                      read_data_transmission_sleep
                    ),
                  virtual_ignition_12v: BwsLoraParser.virtual_ignition_12v(
                    read_virtual_ignition_12v
                  ),
                  virtual_ignition_24v: BwsLoraParser.virtual_ignition_24v(
                    read_virtual_ignition_24v
                  ),
                  heading: BwsLoraParser.heading(read_heading),
                  heading_event_mode: BwsLoraParser.heading_event_mode(
                    read_heading_event_mode
                  ),
                  heading_detection_angle:
                    BwsLoraParser.heading_detection_angle(
                      read_heading_detection_angle
                    ),
                  speed_alert_threshold: BwsLoraParser.speed_alert_threshold(
                    read_speed_alert_threshold
                  ),
                  accel_threshold_for_ignition_on:
                    BwsLoraParser.accel_threshold_for_ignition_on(
                      read_accel_threshold_for_ignition_on
                    ),
                  accel_threshold_for_ignition_off:
                    BwsLoraParser.accel_threshold_for_ignition_off(
                      read_accel_threshold_for_ignition_off
                    ),
                  accel_threshold_for_movement:
                    BwsLoraParser.accel_threshold_for_movement(
                      read_accel_threshold_for_movement
                    ),
                  harsh_acceleration_threshold:
                    BwsLoraParser.harsh_acceleration_threshold(
                      read_harsh_acceleration_threshold
                    ),
                  harsh_braking_threshold:
                    BwsLoraParser.harsh_braking_threshold(
                      read_harsh_braking_threshold
                    ),
                  data_transmission_position:
                    BwsLoraParser.data_transmission_position(
                      read_data_transmission_position
                    ),
                  led_lighting: BwsLoraParser.led_lighting(read_led_lighting),
                  p2p_mode_duration: BwsLoraParser.p2p_mode_duration(
                    read_p2p_mode_duration
                  ),
                  lorawan_mode_duration: BwsLoraParser.lorawan_mode_duration(
                    read_lorawan_mode_duration
                  ),
                  input_1: BwsLoraParser.input_1(read_input_1),
                  input_2: BwsLoraParser.input_2(read_input_2),
                  input_3: BwsLoraParser.input_3(read_input_3),
                  input_4: BwsLoraParser.input_4(read_input_4),
                  input_5: BwsLoraParser.input_5(read_input_5),
                  input_6: BwsLoraParser.input_6(read_input_6),
                  full_configuration_table:
                    BwsLoraParser.full_configuration_table(
                      read_full_configuration_table
                    ),
                  fifo_send_and_hold_times:
                    BwsLoraParser.fifo_send_and_hold_times(
                      read_fifo_send_and_hold_times
                    ),
                  lorawan_data_transmission_event:
                    BwsLoraParser.lorawan_data_transmission_event(
                      read_lorawan_data_transmission_event
                    ),
                  p2p_data_transmission_event:
                    BwsLoraParser.p2p_data_transmission_event(
                      read_p2p_data_transmission_event
                    ),
                  data_transmission_status:
                    BwsLoraParser.data_transmission_status(
                      read_data_transmission_status
                    ),
                  full_functionality_table:
                    BwsLoraParser.full_functionality_table(
                      read_full_functionality_table
                    ),
                  activation_type:
                    BwsLoraParser.activation_type(read_activation_type),
                  mcu_configuration: BwsLoraParser.mcu_configuration(
                    read_mcu_configuration
                  ),
                  output_table: BwsLoraParser.output_table(read_output_table),
                },
              },
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
            };
          } catch (error) {
            console.error("[ERROR] handleConfiguration", error);
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
            response: {} as Record<
              string,
              BwsLora.AutoTest | string | undefined
            >,
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
                      transform: BwsLoraParser.auto_test,
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
    async (detected: Namespace.Detected, id: string) => {
      const { port, equipment } = detected;

      const timestamp_to_send = (getDayZeroTimestamp() / 1000)
        .toString(16)
        .toUpperCase();

      const lora_keys = genKeyLorawan(`0x${id}`, `0x${timestamp_to_send}`);

      const messages = [
        {
          key: "write_serial",
          command: `WINS=${id}\r`,
        },
        {
          key: "write_timestamp",
          command: `WTK=${timestamp_to_send}\r`,
        },
        {
          key: "read_serial",
          command: `RINS\r`,
          delay_before: 2000,
        },
        {
          key: "read_timestamp",
          command: `RTK\r`,
        },
        {
          key: "read_device_address",
          command: `RDA\r`,
        },
        {
          key: "read_device_eui",
          command: `RDE\r`,
        },
        {
          key: "read_application_eui",
          command: `RAP\r`,
        },
        {
          key: "read_application_key",
          command: `RAK\r`,
        },
        {
          key: "read_application_session_key",
          command: `RASK\r`,
        },
        {
          key: "read_network_session_key",
          command: `RNK\r`,
        },
      ] as const;

      try {
        const init_time = Date.now();
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });

        const serial = BwsLoraParser.serial(response.read_serial);
        const timestamp = BwsLoraParser.timestamp(response.read_timestamp);
        const device_address = BwsLoraParser.device_address(
          response.read_device_address
        );
        const device_eui = BwsLoraParser.device_eui(response.read_device_eui);
        const application_eui = BwsLoraParser.application_eui(
          response.read_application_eui
        );
        const application_key = BwsLoraParser.application_key(
          response.read_application_key
        );
        const application_session_key = BwsLoraParser.application_session_key(
          response.read_application_session_key
        );
        const network_session_key = BwsLoraParser.network_session_key(
          response.read_network_session_key
        );

        const matchKeys =
          device_address === lora_keys.device_address &&
          device_eui === lora_keys.device_eui &&
          application_eui === lora_keys.application_eui &&
          application_key === lora_keys.application_key &&
          application_session_key === lora_keys.application_session_key &&
          network_session_key === lora_keys.network_session_key;

        const status =
          id === serial && timestamp_to_send === timestamp && matchKeys;

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
            lora_keys: equipment.lora_keys,
          },
          equipment_after: {
            serial,
            lora_keys: {
              timestamp,
              device_address,
              device_eui,
              application_eui,
              application_key,
              application_session_key,
              network_session_key,
            },
          },
        };
      } catch (error) {
        const message = `[(${new Date().toLocaleString()}) ERROR IN LORA IDENTIFICATION]`;
        console.error(message, error);
        throw new Error(message);
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
                firmware: equipment.firmware,
                lora_keys: equipment.lora_keys,
              },
            };
          } catch (error) {
            const message = `[(${new Date().toLocaleString()}) ERROR IN LORA FIRMWARE UPDATE]`;
            console.error(message, error);
            throw new Error(message);
          }
        })
      );
    },
    [sendMultipleMessages]
  );

  const isIdentified = (input?: {
    serial?: string;
    firmware?: string;
  }): "fully_identified" | "partially_identified" | "not_identified" => {
    if (!input) return "not_identified";
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
    handleGetConfig,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
    handleFirmwareUpdate,
  };
};
