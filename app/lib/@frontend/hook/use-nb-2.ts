import { useCallback } from "react";
import { BwsNb2, BWSNB2ReadParser } from "@/backend/infra/protocol/parser/nb-2";
import { BwsNb2Encoder } from "@/backend/infra/protocol/encoder/nb-2";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, MessageV2, useCommunication } from "./use-communication";
import { ISerialPort, readReader, useSerialPort } from "./use-serial-port";
import { Device } from "@/backend/domain/engineer/entity/device.definition";
import {
  Config,
  BwsNb2Config,
  IConfigurationProfile,
} from "@/backend/domain/engineer/entity/configuration-profile.definition";
import { findOneSerial } from "../../@backend/action/engineer/serial.action";
import { BWSNB2WriteParser } from "../../@backend/infra/protocol/parser/write/nb-2";

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

  export type Profile = IConfigurationProfile<BwsNb2Config>["config"];

  export type ConfigKeys =
    | keyof NonNullable<Profile["general"]>
    | keyof NonNullable<Profile["specific"]>;
}

const readResponse = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  command: string,
  timeout: number = 500,
  check?: string
): Promise<string | undefined> => {
  const decoder = new TextDecoder();
  let buffer = "";

  const base = command.replace("\r\n", "");
  const cmp = check ? check : base.includes("=") ? base : `${base}=`;

  const timeoutPromise = new Promise<undefined>((resolve) =>
    setTimeout(() => resolve(undefined), timeout)
  );

  const readPromise = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value);

      console.info("[RAW DATA]", buffer);

      const lines = buffer.split("\r\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        // agora compara usando cmp
        if (line.length > 0 && line.includes(cmp)) {
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
    const _message = BwsNb2Encoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as Namespace.ConfigKeys] = _message;
  });
  return response;
};

export const useNB2 = () => {
  const {
    ports,
    openPort,
    closePort,
    getReader,
    writeToPort,
    requestPort,
    releaseReader,
  } = useSerialPort({});

  // hook that handles communication process, like retries, delay between messages
  const { sendMultipleMessages, send } = useCommunication<ISerialPort>({
    openTransport: async (transport) => {
      await openPort(transport, {
        baudRate: 115200,
        stopBits: 2,
        bufferSize: 1024,
      });
    },
    closeTransport: closePort,
    sendMessage: async (
      port,
      msg: Message<string, { check?: string; delay_before?: number }>
    ) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout, delay_before, check } = msg;
      if (delay_before) await sleep(delay_before);
      console.info("-------------------------");
      console.info("[MESSAGE SENT]", command);
      await writeToPort(port, command);
      const response = await readResponse(reader, command, timeout, check);
      console.info("[RESPONSE MATCHED]", response);

      await reader.cancel();
      reader.releaseLock();
      return response;
    },
    sendMessageV2: async (
      port,
      msg: MessageV2<{ delay_before?: number; check?: string }>
    ) => {
      const { command, delay_before } = msg;
      if (delay_before) await sleep(delay_before);
      await writeToPort(port, command);
      console.log("[COMMAND]", command);
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
        { command: "RIMEI\r\n" },
        { command: "ICCID\r\n" },
        { command: "RINS\r\n" },
        { command: "RFW\r\n" },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const { pos } = await send({
              transport: port,
              messages,
              preChunk: async (transport) => {
                await getReader(transport);
              },
              posChunk: async (transport) => {
                const reader = await getReader(transport);
                const result = await readReader(reader, 30000);
                return result;
              },
            });
            const detection = pos
              ? BWSNB2ReadParser.parser(
                  pos,
                  "r_imei",
                  "r_serial",
                  "r_firmware",
                  "r_iccid"
                )
              : undefined;
            return {
              port,
              response: {
                imei: detection?.r_imei,
                serial: detection?.r_serial,
                firmware: detection?.r_firmware,
                iccid: detection?.r_iccid,
              },
            };
          } catch (error) {
            console.error("[ERROR] handleDetection use-bws-4g", error);
            return { port };
          }
        })
      );
    },
    [getReader, send]
  );
  const handleGetConfig = useCallback(
    async (detected: Namespace.Detected[]) => {
      const messages = [
        {
          command: "RCN\r\n",
          key: "r_data_transmission_on",
          delay_before: 1000,
        },
        {
          command: "RCW\r\n",
          key: "r_data_transmission_off",
        },
        {
          command: "RCE\r\n",
          key: "r_data_transmission_event",
        },
        {
          command: "RCK\r\n",
          key: "r_keep_alive",
        },
        {
          command: "RIP1\r\n",
          key: "r_ip_primary",
        },
        {
          command: "RIP2\r\n",
          key: "r_ip_secondary",
        },
        {
          command: "RID1\r\n",
          key: "r_dns_primary",
        },
        {
          command: "RID2\r\n",
          key: "r_dns_secondary",
        },
        { command: "RIAP\r\n", key: "r_apn" },
        {
          command: "RCS\r\n",
          key: "r_time_to_sleep",
        },
        { command: "RODM\r\n", key: "r_odometer" },
        {
          command: "RIG12\r\n",
          key: "r_virtual_ignition_12v",
        },
        {
          command: "RIG24\r\n",
          key: "r_virtual_ignition_24v",
        },
        {
          command: "RFA\r\n",
          key: "r_heading_detection_angle",
        },
        {
          command: "RFV\r\n",
          key: "r_speed_alert_threshold",
        },
        {
          command: "RFTON\r\n",
          key: "r_accel_threshold_for_ignition_on",
        },
        {
          command: "RFTOF\r\n",
          key: "r_accel_threshold_for_ignition_off",
        },
        {
          command: "RFAV\r\n",
          key: "r_accel_threshold_for_movement",
        },
        {
          command: "RFMA\r\n",
          key: "r_harsh_acceleration_threshold",
        },
        {
          command: "RFMD\r\n",
          key: "r_harsh_braking_threshold",
        },
        {
          command: "RC\r\n",
          key: "r_full_configuration_table",
        },
        {
          command: "RF\r\n",
          key: "r_full_functionality_table",
        },
        {
          command: "RFSM\r\n",
          key: "r_economy_mode",
        },
        {
          command: "ROUT\r\n",
          key: "r_lock_type",
        },
      ] as const;

      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const { pos } = await send({
              transport: port,
              messages,
              preChunk: async (transport) => {
                await getReader(transport);
              },
              posChunk: async (transport) => {
                const reader = await getReader(transport);
                const result = await readReader(reader, 30000);
                return result;
              },
            });

            const raw_config = pos
              ? BWSNB2ReadParser.parser(
                  pos,
                  "r_data_transmission_on",
                  "r_data_transmission_off",
                  "r_data_transmission_event",
                  "r_keep_alive",
                  "r_ip_primary",
                  "r_ip_secondary",
                  "r_dns_primary",
                  "r_dns_secondary",
                  "r_apn",
                  "r_time_to_sleep",
                  "r_odometer",
                  "r_virtual_ignition_12v",
                  "r_virtual_ignition_24v",
                  "r_heading_detection_angle",
                  "r_speed_alert_threshold",
                  "r_accel_threshold_for_ignition_on",
                  "r_accel_threshold_for_ignition_off",
                  "r_accel_threshold_for_movement",
                  "r_harsh_acceleration_threshold",
                  "r_harsh_braking_threshold",
                  "r_full_configuration_table",
                  "r_full_functionality_table",
                  "r_economy_mode",
                  "r_lock_type"
                )
              : {};

            const config = {
              general: {
                keep_alive: raw_config.r_keep_alive,
                ip_primary: raw_config.r_ip_primary,
                ip_secondary: raw_config.r_ip_secondary,
                dns_primary: raw_config.r_dns_primary,
                dns_secondary: raw_config.r_dns_secondary,
                apn: raw_config.r_apn,
                data_transmission_on: raw_config.r_data_transmission_on,
                data_transmission_off: raw_config.r_data_transmission_off,
              },
              specific: {
                data_transmission_event: raw_config.r_data_transmission_event,
                time_to_sleep: raw_config.r_time_to_sleep,
                odometer: raw_config.r_odometer,
                virtual_ignition_12v: raw_config.r_virtual_ignition_12v,
                virtual_ignition_24v: raw_config.r_virtual_ignition_24v,
                heading_detection_angle: raw_config.r_heading_detection_angle,
                speed_alert_threshold: raw_config.r_speed_alert_threshold,
                accel_threshold_for_ignition_on:
                  raw_config.r_accel_threshold_for_ignition_on,
                accel_threshold_for_ignition_off:
                  raw_config.r_accel_threshold_for_ignition_off,
                accel_threshold_for_movement:
                  raw_config.r_accel_threshold_for_movement,
                harsh_acceleration_threshold:
                  raw_config.r_harsh_acceleration_threshold,
                harsh_braking_threshold: raw_config.r_harsh_braking_threshold,
                full_configuration_table: raw_config.r_full_configuration_table,
                full_functionality_table: raw_config.r_full_functionality_table,
                economy_mode: raw_config.r_economy_mode,
                lock_type: raw_config.r_lock_type,
              },
            };

            return {
              port,
              equipment,
              config,
              messages: messages.map(({ key, command }) => ({
                key,
                request: command,
                response: raw_config[key],
              })),
            };
          } catch (error) {
            console.error("[ERROR] handleGetConfig", error);
            return { port, equipment, messages: [], config: {} };
          }
        })
      );
    },
    [getReader, send]
  );
  const handleConfiguration = useCallback(
    async (
      detected: Namespace.Detected[],
      configuration_profile: IConfigurationProfile
    ) => {
      const write_messages = typedObjectEntries(
        generateMessages(configuration_profile)
      ).map(([key, command]) => ({
        key: `w_${key}`,
        command,
      }));
      const read_messages = [
        {
          command: "RCN\r\n",
          key: "r_data_transmission_on",
          delay_before: 1000,
        },
        {
          command: "RCW\r\n",
          key: "r_data_transmission_off",
        },
        {
          command: "RCE\r\n",
          key: "r_data_transmission_event",
        },
        {
          command: "RCK\r\n",
          key: "r_keep_alive",
        },
        {
          command: "RIP1\r\n",
          key: "r_ip_primary",
        },
        {
          command: "RIP2\r\n",
          key: "r_ip_secondary",
        },
        {
          command: "RID1\r\n",
          key: "r_dns_primary",
        },
        {
          command: "RID2\r\n",
          key: "r_dns_secondary",
        },
        { command: "RIAP\r\n", key: "r_apn" },
        {
          command: "RCS\r\n",
          key: "r_time_to_sleep",
        },
        { command: "RODM\r\n", key: "r_odometer" },
        {
          command: "RIG12\r\n",
          key: "r_virtual_ignition_12v",
        },
        {
          command: "RIG24\r\n",
          key: "r_virtual_ignition_24v",
        },
        {
          command: "RFA\r\n",
          key: "r_heading_detection_angle",
        },
        {
          command: "RFV\r\n",
          key: "r_speed_alert_threshold",
        },
        {
          command: "RFTON\r\n",
          key: "r_accel_threshold_for_ignition_on",
        },
        {
          command: "RFTOF\r\n",
          key: "r_accel_threshold_for_ignition_off",
        },
        {
          command: "RFAV\r\n",
          key: "r_accel_threshold_for_movement",
        },
        {
          command: "RFMA\r\n",
          key: "r_harsh_acceleration_threshold",
        },
        {
          command: "RFMD\r\n",
          key: "r_harsh_braking_threshold",
        },
        {
          command: "RC\r\n",
          key: "r_full_configuration_table",
        },
        {
          command: "RF\r\n",
          key: "r_full_functionality_table",
        },
        {
          command: "RFSM\r\n",
          key: "r_economy_mode",
        },
        {
          command: "ROUT\r\n",
          key: "r_lock_type",
        },
      ] as const;
      return await Promise.all(
        detected.map(async ({ port, equipment }) => {
          try {
            const init_time = Date.now();
            const { pos } = await send({
              transport: port,
              messages: [...write_messages, ...read_messages],
              preChunk: async (transport) => {
                await getReader(transport);
              },
              posChunk: async (transport) => {
                const reader = await getReader(transport);
                const result = await readReader(reader, 30000);
                return result;
              },
            });
            const end_time = Date.now();
            const write_response = pos
              ? BWSNB2WriteParser.parser(
                  pos,
                  ...(write_messages.map((msg) => msg.key) as any)
                )
              : {};
            const read_response = pos
              ? BWSNB2ReadParser.parser(
                  pos,
                  "r_serial",
                  "r_imei",
                  "r_data_transmission_on",
                  "r_data_transmission_off",
                  "r_data_transmission_event",
                  "r_keep_alive",
                  "r_ip_primary",
                  "r_ip_secondary",
                  "r_dns_primary",
                  "r_dns_secondary",
                  "r_apn",
                  "r_time_to_sleep",
                  "r_odometer",
                  "r_virtual_ignition_12v",
                  "r_virtual_ignition_24v",
                  "r_heading_detection_angle",
                  "r_speed_alert_threshold",
                  "r_accel_threshold_for_ignition_on",
                  "r_accel_threshold_for_ignition_off",
                  "r_accel_threshold_for_movement",
                  "r_harsh_acceleration_threshold",
                  "r_harsh_braking_threshold",
                  "r_input_1",
                  "r_input_2",
                  "r_input_3",
                  "r_input_4",
                  "r_full_configuration_table",
                  "r_full_functionality_table",
                  "r_economy_mode",
                  "r_lock_type"
                )
              : {};

            return {
              equipment,
              port,
              init_time,
              end_time,
              status: Object.entries(write_response).every(
                ([_, value]) => typeof value !== "undefined"
              ),
              messages: [...write_messages, ...read_messages].map(
                ({ key, command }) => ({
                  key,
                  request: command,
                  response:
                    write_response[key as keyof typeof write_response] ||
                    read_response[key as keyof typeof read_response],
                })
              ),
              applied_profile: {
                general: {
                  keep_alive: read_response.r_keep_alive,
                  ip_primary: read_response.r_ip_primary,
                  ip_secondary: read_response.r_ip_secondary,
                  dns_primary: read_response.r_dns_primary,
                  dns_secondary: read_response.r_dns_secondary,
                  apn: read_response.r_apn,
                  data_transmission_on: read_response.r_data_transmission_on,
                  data_transmission_off: read_response.r_data_transmission_off,
                },
                specific: {
                  data_transmission_event:
                    read_response.r_data_transmission_event,
                  time_to_sleep: read_response.r_time_to_sleep,
                  odometer: read_response.r_odometer,
                  virtual_ignition_12v: read_response.r_virtual_ignition_12v,
                  virtual_ignition_24v: read_response.r_virtual_ignition_24v,
                  heading_detection_angle:
                    read_response.r_heading_detection_angle,
                  speed_alert_threshold: read_response.r_speed_alert_threshold,
                  accel_threshold_for_ignition_on:
                    read_response.r_accel_threshold_for_ignition_on,
                  accel_threshold_for_ignition_off:
                    read_response.r_accel_threshold_for_ignition_off,
                  accel_threshold_for_movement:
                    read_response.r_accel_threshold_for_movement,
                  harsh_acceleration_threshold:
                    read_response.r_harsh_acceleration_threshold,
                  harsh_braking_threshold:
                    read_response.r_harsh_braking_threshold,
                  full_configuration_table:
                    read_response.r_full_configuration_table,
                  full_functionality_table:
                    read_response.r_full_functionality_table,
                  economy_mode: read_response.r_economy_mode,
                  lock_type: read_response.r_lock_type,
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
    [send, getReader]
  );

  const handleAutoTest = useCallback(
    async (ports: ISerialPort[]) => {
      return await Promise.all(
        ports.map(async (port) => {
          const resultTemplate = {
            port,
            response: {} as Record<
              string,
              BwsNb2.AutoTest | string | undefined
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
                      transform: BWSNB2ReadParser.auto_test,
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
                  DEV: autotest["DEV"] === "DM_BWS_NB2",
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
                  RSI: autotest["RSI"] === "OK",
                  SN: Boolean(autotest["SN"]?.length),
                  VCC: !isNaN(VCC) && VCC <= 130 && VCC >= 120,
                  TEMP: !isNaN(TEMP) && TEMP <= 28 && TEMP >= 23,
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

      try {
        const identification = await findOneSerial({ serial: id });
        if (!identification) {
          throw new Error("Serial não encontrado na base");
        }

        const messages = [
          {
            key: "write_serial",
            command: `WINS=${id}\r\n`,
            check: "WINS=",
          },
          {
            key: "write_imei",
            command: `WIMEI=${identification.imei}\r\n`,
            check: "WIMEI=",
          },
          {
            key: "r_serial",
            command: `RINS\r\n`,
            delay_before: 3000,
          },
          {
            key: "r_imei",
            command: `RIMEI\r\n`,
          },
        ] as const;

        const init_time = Date.now();
        const response = await sendMultipleMessages({
          transport: port,
          messages,
        });

        const [imei, serial] = [
          BWSNB2ReadParser.imei(response.r_imei),
          BWSNB2ReadParser.serial(response.r_serial),
        ];

        const status =
          identification.serial === serial && identification.imei === imei;

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
            serial,
            imei,
          },
        };
      } catch (error) {
        const message = `[(${new Date().toLocaleString()}) ERROR IN NB2 IDENTIFICATION]`;
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
                check: "CMD FW",
              },
            ] as const;

            const init_time = Date.now();
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
            const status = Boolean(
              response.update_firmware && response.update_firmware.length > 0
            );
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
            const message = `[(${new Date().toLocaleString()}) ERROR IN NB2 FIRMWARE UPDATE]`;
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
