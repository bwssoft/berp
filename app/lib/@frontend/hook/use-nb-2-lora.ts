import { useCallback } from "react";
import { BwsNb2Lora, BwsNb2LoraParser } from "@/backend/infra/protocol/parser/nb-2-lora";
import { BwsNb2LoraEncoder } from "@/backend/infra/protocol/encoder/nb-2-lora";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import { Device } from "@/backend/domain/engineer/entity/device.definition";
import {
  IConfigurationProfile,
  BwsNb2LoraConfig,
} from "@/backend/domain/engineer/entity/configuration-profile.definition";
import { getDayZeroTimestamp } from "../../util/get-day-zero-timestamp";
import { findOneSerial } from "../../@backend/action/engineer/serial.action";
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

  export type Profile = IConfigurationProfile<BwsNb2LoraConfig>["config"];

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
  const timeoutPromise = new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), timeout)
  );

  const readPromise = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value);

      console.log("[RAW DATA]", buffer);

      let lines = buffer.split("\r\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.length > 0 && line.includes(command.replace("\r\n", ""))) {
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
    const _message = BwsNb2LoraEncoder.encoder({
      command: message,
      args,
    } as any);
    if (!_message) return;
    response[message as Namespace.ConfigKeys] = _message;
  });
  return response;
};

export const useNB2Lora = () => {
  const { ports, openPort, closePort, getReader, writeToPort, requestPort } =
    useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages } = useCommunication<ISerialPort>({
    openTransport: async (transport) => {
      await openPort(transport, {
        baudRate: 115200,
        stopBits: 2,
      });
    },
    closeTransport: closePort,
    sendMessage: async (
      port,
      msg: Message<string, { check?: string; delay_before?: number }>
    ) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout, check, delay_before } = msg;
      console.info("-------------------------");
      console.info("[MESSAGE SENT]", command);
      if (delay_before) await sleep(delay_before);
      await writeToPort(port, command);
      const response = await readResponse(reader, check ?? command, timeout);
      console.info("[RESPONSE MATCHED]", response);
      await reader.cancel();
      reader.releaseLock();
      return response;
    },
    options: {
      delayBetweenMessages: 300,
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
          command: `RINS\r\n`,
          transform: BwsNb2LoraParser.serial,
        },
        {
          command: "RFW\r",
          key: "firmware",
          transform: BwsNb2LoraParser.firmware,
        },
        {
          key: "timestamp",
          command: `RTK\r\n`,
          transform: BwsNb2LoraParser.timestamp,
        },
        {
          key: "device_address",
          command: `RDA\r\n`,
          transform: BwsNb2LoraParser.device_address,
        },
        {
          key: "device_eui",
          command: `RDE\r\n`,
          transform: BwsNb2LoraParser.device_eui,
        },
        {
          key: "application_eui",
          command: `RAP\r\n`,
          transform: BwsNb2LoraParser.application_eui,
        },
        {
          key: "application_key",
          command: `RAK\r\n`,
          transform: BwsNb2LoraParser.application_key,
        },
        {
          key: "application_session_key",
          command: `RASK\r\n`,
          transform: BwsNb2LoraParser.application_session_key,
        },
        {
          key: "network_session_key",
          command: `RNK\r\n`,
          transform: BwsNb2LoraParser.network_session_key,
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
                check: undefined,
                specific: {
                  odometer: BwsNb2LoraParser.odometer(response.odometer),
                  data_transmission_sleep:
                    BwsNb2LoraParser.data_transmission_sleep(
                      response.data_transmission_sleep
                    ),
                  virtual_ignition_12v: BwsNb2LoraParser.virtual_ignition_12v(
                    response.virtual_ignition_12v
                  ),
                  virtual_ignition_24v: BwsNb2LoraParser.virtual_ignition_24v(
                    response.virtual_ignition_24v
                  ),
                  heading: BwsNb2LoraParser.heading(response.heading),
                  heading_event_mode: BwsNb2LoraParser.heading_event_mode(
                    response.heading_event_mode
                  ),
                  heading_detection_angle:
                    BwsNb2LoraParser.heading_detection_angle(
                      response.heading_detection_angle
                    ),
                  speed_alert_threshold: BwsNb2LoraParser.speed_alert_threshold(
                    response.speed_alert_threshold
                  ),
                  accel_threshold_for_ignition_on:
                    BwsNb2LoraParser.accel_threshold_for_ignition_on(
                      response.accel_threshold_for_ignition_on
                    ),
                  accel_threshold_for_ignition_off:
                    BwsNb2LoraParser.accel_threshold_for_ignition_off(
                      response.accel_threshold_for_ignition_off
                    ),
                  accel_threshold_for_movement:
                    BwsNb2LoraParser.accel_threshold_for_movement(
                      response.accel_threshold_for_movement
                    ),
                  harsh_acceleration_threshold:
                    BwsNb2LoraParser.harsh_acceleration_threshold(
                      response.harsh_acceleration_threshold
                    ),
                  harsh_braking_threshold:
                    BwsNb2LoraParser.harsh_braking_threshold(
                      response.harsh_braking_threshold
                    ),
                  data_transmission_position:
                    BwsNb2LoraParser.data_transmission_position(
                      response.data_transmission_position
                    ),
                  led_lighting: BwsNb2LoraParser.led_lighting(
                    response.led_lighting
                  ),
                  p2p_mode_duration: BwsNb2LoraParser.p2p_mode_duration(
                    response.p2p_mode_duration
                  ),
                  lorawan_mode_duration: BwsNb2LoraParser.lorawan_mode_duration(
                    response.lorawan_mode_duration
                  ),
                  input_1: BwsNb2LoraParser.input_1(response.input_1),
                  input_2: BwsNb2LoraParser.input_2(response.input_2),
                  input_3: BwsNb2LoraParser.input_3(response.input_3),
                  input_4: BwsNb2LoraParser.input_4(response.input_4),
                  input_5: BwsNb2LoraParser.input_5(response.input_5),
                  input_6: BwsNb2LoraParser.input_6(response.input_6),
                  full_configuration_table:
                    BwsNb2LoraParser.full_configuration_table(
                      response.full_configuration_table
                    ),
                  fifo_send_and_hold_times:
                    BwsNb2LoraParser.fifo_send_and_hold_times(
                      response.fifo_send_and_hold_times
                    ),
                  lorawan_data_transmission_event:
                    BwsNb2LoraParser.lorawan_data_transmission_event(
                      response.lorawan_data_transmission_event
                    ),
                  p2p_data_transmission_event:
                    BwsNb2LoraParser.p2p_data_transmission_event(
                      response.p2p_data_transmission_event
                    ),
                  data_transmission_status:
                    BwsNb2LoraParser.data_transmission_status(
                      response.data_transmission_status
                    ),
                  full_functionality_table:
                    BwsNb2LoraParser.full_functionality_table(
                      response.full_functionality_table
                    ),
                  activation_type: BwsNb2LoraParser.activation_type(
                    response.activation_type
                  ),
                  mcu_configuration: BwsNb2LoraParser.mcu_configuration(
                    response.mcu_configuration
                  ),
                  output_table: BwsNb2LoraParser.output_table(
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
        {
          command: "RCN\r",
          key: "read_data_transmission_on",
        },
        {
          command: "RCW\r",
          key: "read_data_transmission_off",
        },
        {
          command: "RCE\r",
          key: "read_data_transmission_event",
        },
        {
          command: "RCK\r",
          key: "read_keep_alive",
        },

        {
          command: "RIP1\r",
          key: "read_ip_primary",
        },
        {
          command: "RIP2\r",
          key: "read_ip_secondary",
        },
        {
          command: "RID1\r",
          key: "read_dns_primary",
        },
        {
          command: "RID2\r",
          key: "read_dns_secondary",
        },
        { command: "RIAP\r", key: "read_apn" },

        {
          command: "RCS\r",
          key: "read_time_to_sleep",
        },
        { command: "RODM\r", key: "read_odometer" },

        {
          command: "RIG12\r",
          key: "read_virtual_ignition_12v",
        },
        {
          command: "RIG24\r",
          key: "read_virtual_ignition_24v",
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
          command: "RC\r",
          key: "read_full_configuration_table",
        },
        {
          command: "RF\r",
          key: "read_full_functionality_table",
        },

        {
          command: "RFSM\r",
          key: "read_economy_mode",
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
              read_data_transmission_on,
              read_data_transmission_off,
              read_data_transmission_event,
              read_keep_alive,
              read_ip_primary,
              read_ip_secondary,
              read_dns_primary,
              read_dns_secondary,
              read_apn,
              read_time_to_sleep,
              read_odometer,
              read_virtual_ignition_12v,
              read_virtual_ignition_24v,
              read_heading_detection_angle,
              read_speed_alert_threshold,
              read_accel_threshold_for_ignition_on,
              read_accel_threshold_for_ignition_off,
              read_accel_threshold_for_movement,
              read_harsh_acceleration_threshold,
              read_harsh_braking_threshold,
              read_full_configuration_table,
              read_full_functionality_table,
              read_economy_mode,
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
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: response[key],
              })),
              applied_profile: {
                specific: {
                  data_transmission_on: read_data_transmission_on,
                  data_transmission_off: read_data_transmission_off,
                  data_transmission_event: read_data_transmission_event,
                  keep_alive: read_keep_alive,
                  ip_primary: read_ip_primary,
                  ip_secondary: read_ip_secondary,
                  dns_primary: read_dns_primary,
                  dns_secondary: read_dns_secondary,
                  apn: read_apn,
                  time_to_sleep: read_time_to_sleep,
                  odometer: read_odometer,
                  virtual_ignition_12v: read_virtual_ignition_12v,
                  virtual_ignition_24v: read_virtual_ignition_24v,
                  heading_detection_angle: read_heading_detection_angle,
                  speed_alert_threshold: read_speed_alert_threshold,
                  accel_threshold_for_ignition_on:
                    read_accel_threshold_for_ignition_on,
                  accel_threshold_for_ignition_off:
                    read_accel_threshold_for_ignition_off,
                  accel_threshold_for_movement:
                    read_accel_threshold_for_movement,
                  harsh_acceleration_threshold:
                    read_harsh_acceleration_threshold,
                  harsh_braking_threshold: read_harsh_braking_threshold,
                  full_configuration_table: read_full_configuration_table,
                  full_functionality_table: read_full_functionality_table,
                  economy_mode: read_economy_mode,
                },
              },
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
              BwsNb2Lora.AutoTest | string | undefined
            >,
            messages: [
              { key: "start", command: "START\r\n" },
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
              messages: [{ key: "start", command: "START\r\n" }] as const,
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
                      transform: BwsNb2LoraParser.auto_test,
                    },
                  ] as const,
                });

                const autotest = autotestResponse[key];

                if (!autotest) continue;

                const BATT_VOLT = Number(autotest["BATT_VOLT"]);
                const VCC = Number(autotest["VCC"]);
                const TEMP = Number(autotest["TEMP"]);

                const isBattGood =
                  !isNaN(BATT_VOLT) && BATT_VOLT <= 43 && BATT_VOLT >= 40;

                resultTemplate.analysis = {
                  DEV: autotest["DEV"] === "DM_BWS_NB2_LORA",
                  ACELC: Boolean(autotest["ACELC"]?.length),
                  ACELP: autotest["ACELP"] === "OK",
                  BATT_VOLT: lastBattResult || isBattGood,
                  CHARGER: autotest["CHARGER"] === "OK",
                  FW: Boolean(autotest["FW"]?.length),
                  GPS: autotest["GPS"] === "OK",
                  // GPSf: autotest["GPSf"] === "OK",
                  IC: isIccid(autotest["IC"] ?? ""),
                  ID_ACEL: Boolean(autotest["ID_ACEL"]?.length),
                  ID_MEM: Boolean(autotest["ID_MEM"]?.length),
                  IM: isImei(autotest["IM"] ?? ""),
                  IN1: autotest["IN1"] === "OK",
                  IN2: autotest["IN2"] === "OK",
                  MDM: autotest["MDM"] === "OK",
                  OUT: autotest["OUT"] === "OK",
                  RSSI: autotest["RSSI"] === "OK",
                  SN: Boolean(autotest["SN"]?.length),
                  VCC: !isNaN(VCC) && VCC <= 130 && VCC >= 120,
                  TEMP: !isNaN(TEMP) && TEMP <= 28 && TEMP >= 23,
                  RF: autotest["RF"] === "OK",
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

      try {
        const identification = await findOneSerial({ serial: id });
        if (!identification) {
          throw new Error("Serial não encontrado na base");
        }

        const messages = [
          {
            key: "write_nb2_serial",
            command: `WINS=${id}\r\n`,
          },
          {
            key: "write_nb2_imei",
            command: `WIMEI=${identification.imei}\r\n`,
          },
          {
            key: "write_lora_serial",
            command: `LWINS=${id}\r\n`,
            delay_before: 1000,
          },
          {
            key: "write_lora_timestamp",
            command: `LWTK=${timestamp_to_send}\r\n`,
          },
          {
            key: "read_nb2_serial",
            command: `RINS\r\n`,
            delay_before: 2000,
          },
          {
            key: "read_nb2_imei",
            command: `RIMEI\r\n`,
          },
          {
            key: "read_lora_serial",
            command: `LRINS\r\n`,
          },
          {
            key: "read_timestamp",
            command: `LRTK\r\n`,
          },
          {
            key: "read_device_address",
            command: `LRDA\r\n`,
          },
          {
            key: "read_device_eui",
            command: `LRDE\r\n`,
          },
          {
            key: "read_application_eui",
            command: `LRAP\r\n`,
          },
          {
            key: "read_application_key",
            command: `LRAK\r\n`,
          },
          {
            key: "read_application_session_key",
            command: `LRASK\r\n`,
          },
          {
            key: "read_network_session_key",
            command: `LRNK\r\n`,
          },
        ] as const;

        const init_time = Date.now();
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });

        const nb2_serial = BwsNb2LoraParser.serial(response.read_nb2_serial);
        const nb2_imei = BwsNb2LoraParser.imei(response.read_nb2_imei);
        const lora_serial = BwsNb2LoraParser.serial(response.read_lora_serial);
        const timestamp = BwsNb2LoraParser.timestamp(response.read_timestamp);
        const device_address = BwsNb2LoraParser.device_address(
          response.read_device_address
        );
        const device_eui = BwsNb2LoraParser.device_eui(
          response.read_device_eui
        );
        const application_eui = BwsNb2LoraParser.application_eui(
          response.read_application_eui
        );
        const application_key = BwsNb2LoraParser.application_key(
          response.read_application_key
        );
        const application_session_key =
          BwsNb2LoraParser.application_session_key(
            response.read_application_session_key
          );
        const network_session_key = BwsNb2LoraParser.network_session_key(
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
          id === nb2_serial &&
          identification.imei === nb2_imei &&
          id === lora_serial &&
          timestamp_to_send === timestamp &&
          matchKeys;

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
            lora_keys: equipment.lora_keys,
          },
          equipment_after: {
            serial: nb2_serial,
            imei: nb2_imei,
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
        const message = `[(${new Date().toLocaleString()}) ERROR IN NB2LORA IDENTIFICATION]`;
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
                imei: equipment.imei,
                firmware: equipment.firmware,
                lora_keys: equipment.lora_keys,
              },
            };
          } catch (error) {
            const message = `[(${new Date().toLocaleString()}) ERROR IN NB2 + LORA FIRMWARE UPDATE]`;
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
    serial?: string;
    firmware?: string;
  }): "fully_identified" | "partially_identified" | "not_identified" => {
    if (!input) return "not_identified";
    const { serial, imei, iccid, firmware } = input;
    const identified = [serial, imei, iccid, firmware];
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
