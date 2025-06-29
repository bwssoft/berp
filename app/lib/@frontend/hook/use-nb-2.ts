import { useCallback } from "react";
import {
  BwsNb2,
  BwsNb2Parser,
  BwsNb2Encoder,
} from "../../@backend/infra/protocol";
import { isIccid, isImei, sleep, typedObjectEntries } from "../../util";
import { Message, useCommunication } from "./use-communication";
import { ISerialPort, useSerialPort } from "./use-serial-port";
import {
  Config,
  Device,
  IConfigurationProfile,
  BwsNb2Config,
} from "../../@backend/domain";
import { findOneSerial } from "../../@backend/action/engineer/serial.action";

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
    console.log("----generating messages------");
    console.log("message", message);
    const _message = BwsNb2Encoder.encoder({ command: message, args } as any);
    if (!_message) return;
    response[message as Namespace.ConfigKeys] = _message;
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
      });
    },
    closeTransport: closePort,
    sendMessage: async (
      port,
      msg: Message<string, { delay_before?: number }>
    ) => {
      const reader = await getReader(port);
      if (!reader) throw new Error("Reader não disponível");
      const { command, timeout, delay_before } = msg;
      if (delay_before) await sleep(delay_before);
      console.log("-------------------------");
      console.log("command", command);
      await writeToPort(port, command);
      const response = await readResponse(reader, command, timeout);
      console.log("response", response);

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
        { command: "RIMEI\r\n", key: "imei", transform: BwsNb2Parser.imei },
        { command: "ICCID\r\n", key: "iccid", transform: BwsNb2Parser.iccid },
        { command: "RINS\r\n", key: "serial", transform: BwsNb2Parser.serial },
        {
          command: "RFW\r\n",
          key: "firmware",
          transform: BwsNb2Parser.firmware,
        },
      ] as const;
      return await Promise.all(
        ports.map(async (port) => {
          try {
            const response = await sendMultipleMessages({
              transport: port,
              messages,
            });
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
        {
          command: "RCN\r\n",
          key: "data_transmission_on",
          transform: BwsNb2Parser.data_transmission_on,
        },
        {
          command: "RCW\r\n",
          key: "data_transmission_off",
          transform: BwsNb2Parser.data_transmission_off,
        },
        {
          command: "RCE\r\n",
          key: "data_transmission_event",
          transform: BwsNb2Parser.data_transmission_event,
        },
        {
          command: "RCK\r\n",
          key: "keep_alive",
          transform: BwsNb2Parser.keep_alive,
        },

        {
          command: "RIP1\r\n",
          key: "ip_primary",
          transform: BwsNb2Parser.ip_primary,
        },
        {
          command: "RIP2\r\n",
          key: "ip_secondary",
          transform: BwsNb2Parser.ip_secondary,
        },
        {
          command: "RID1\r\n",
          key: "dns_primary",
          transform: BwsNb2Parser.dns_primary,
        },
        {
          command: "RID2\r\n",
          key: "dns_secondary",
          transform: BwsNb2Parser.dns_secondary,
        },
        { command: "RIAP\r\n", key: "apn", transform: BwsNb2Parser.apn },

        {
          command: "RCS\r\n",
          key: "time_to_sleep",
          transform: BwsNb2Parser.time_to_sleep,
        },
        {
          command: "RODM\r\n",
          key: "odometer",
          transform: BwsNb2Parser.odometer,
        },

        {
          command: "RIG12\r\n",
          key: "virtual_ignition_12v",
          transform: BwsNb2Parser.virtual_ignition_12v,
        },
        {
          command: "RIG24\r\n",
          key: "virtual_ignition_24v",
          transform: BwsNb2Parser.virtual_ignition_24v,
        },

        {
          command: "RFA\r\n",
          key: "heading_detection_angle",
          transform: BwsNb2Parser.heading_detection_angle,
        },
        {
          command: "RFV\r\n",
          key: "speed_alert_threshold",
          transform: BwsNb2Parser.speed_alert_threshold,
        },

        {
          command: "RFTON\r\n",
          key: "accel_threshold_for_ignition_on",
          transform: BwsNb2Parser.accel_threshold_for_ignition_on,
        },
        {
          command: "RFTOF\r\n",
          key: "accel_threshold_for_ignition_off",
          transform: BwsNb2Parser.accel_threshold_for_ignition_off,
        },
        {
          command: "RFAV\r\n",
          key: "accel_threshold_for_movement",
          transform: BwsNb2Parser.accel_threshold_for_movement,
        },

        {
          command: "RFMA\r\n",
          key: "harsh_acceleration_threshold",
          transform: BwsNb2Parser.harsh_acceleration_threshold,
        },
        {
          command: "RFMD\r\n",
          key: "harsh_braking_threshold",
          transform: BwsNb2Parser.harsh_braking_threshold,
        },

        {
          command: "RIN1\r\n",
          key: "input_1",
          transform: BwsNb2Parser.input_1,
        },
        {
          command: "RIN2\r\n",
          key: "input_2",
          transform: BwsNb2Parser.input_2,
        },
        {
          command: "RIN3\r\n",
          key: "input_3",
          transform: BwsNb2Parser.input_3,
        },
        {
          command: "RIN4\r\n",
          key: "input_4",
          transform: BwsNb2Parser.input_4,
        },

        {
          command: "RC\r\n",
          key: "full_configuration_table",
          transform: BwsNb2Parser.full_configuration_table,
        },
        {
          command: "RF\r\n",
          key: "full_functionality_table",
          transform: BwsNb2Parser.full_functionality_table,
        },

        {
          command: "RFSM\r\n",
          key: "sleep_mode",
          transform: BwsNb2Parser.sleep_mode,
        },
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
                  data_transmission_on,
                  data_transmission_off,
                  ip_primary,
                  ip_secondary,
                  apn,
                  keep_alive,
                  dns_primary,
                  dns_secondary,
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
          command: "RCN\r\n",
          key: "read_data_transmission_on",
          delay_before: 1000,
        },
        {
          command: "RCW\r\n",
          key: "read_data_transmission_off",
        },
        {
          command: "RCE\r\n",
          key: "read_data_transmission_event",
        },
        {
          command: "RCK\r\n",
          key: "read_keep_alive",
        },
        {
          command: "RIP1\r\n",
          key: "read_ip_primary",
        },
        {
          command: "RIP2\r\n",
          key: "read_ip_secondary",
        },
        {
          command: "RID1\r\n",
          key: "read_dns_primary",
        },
        {
          command: "RID2\r\n",
          key: "read_dns_secondary",
        },
        { command: "RIAP\r\n", key: "read_apn" },
        {
          command: "RCS\r\n",
          key: "read_time_to_sleep",
        },
        { command: "RODM\r\n", key: "read_odometer" },
        {
          command: "RIG12\r\n",
          key: "read_virtual_ignition_12v",
        },
        {
          command: "RIG24\r\n",
          key: "read_virtual_ignition_24v",
        },
        {
          command: "RFA\r\n",
          key: "read_heading_detection_angle",
        },
        {
          command: "RFV\r\n",
          key: "read_speed_alert_threshold",
        },
        {
          command: "RFTON\r\n",
          key: "read_accel_threshold_for_ignition_on",
        },
        {
          command: "RFTOF\r\n",
          key: "read_accel_threshold_for_ignition_off",
        },
        {
          command: "RFAV\r\n",
          key: "read_accel_threshold_for_movement",
        },
        {
          command: "RFMA\r\n",
          key: "read_harsh_acceleration_threshold",
        },
        {
          command: "RFMD\r\n",
          key: "read_harsh_braking_threshold",
        },
        {
          command: "RC\r\n",
          key: "read_full_configuration_table",
        },
        {
          command: "RF\r\n",
          key: "read_full_functionality_table",
        },
        {
          command: "RFSM\r\n",
          key: "read_sleep_mode",
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
              read_sleep_mode,
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
                general: {
                  keep_alive: BwsNb2Parser.keep_alive(read_keep_alive),
                  ip_primary: BwsNb2Parser.ip_primary(read_ip_primary),
                  ip_secondary: BwsNb2Parser.ip_secondary(read_ip_secondary),
                  dns_primary: BwsNb2Parser.dns_primary(read_dns_primary),
                  dns_secondary: BwsNb2Parser.dns_secondary(read_dns_secondary),
                  apn: BwsNb2Parser.apn(read_apn),
                  data_transmission_on: BwsNb2Parser.data_transmission_on(
                    read_data_transmission_on
                  ),
                  data_transmission_off: BwsNb2Parser.data_transmission_off(
                    read_data_transmission_off
                  ),
                },
                specific: {
                  data_transmission_event: BwsNb2Parser.data_transmission_event(
                    read_data_transmission_event
                  ),
                  time_to_sleep: BwsNb2Parser.time_to_sleep(read_time_to_sleep),
                  odometer: BwsNb2Parser.odometer(read_odometer),
                  virtual_ignition_12v: BwsNb2Parser.virtual_ignition_12v(
                    read_virtual_ignition_12v
                  ),
                  virtual_ignition_24v: BwsNb2Parser.virtual_ignition_24v(
                    read_virtual_ignition_24v
                  ),
                  heading_detection_angle: BwsNb2Parser.heading_detection_angle(
                    read_heading_detection_angle
                  ),
                  speed_alert_threshold: BwsNb2Parser.speed_alert_threshold(
                    read_speed_alert_threshold
                  ),
                  accel_threshold_for_ignition_on:
                    BwsNb2Parser.accel_threshold_for_ignition_on(
                      read_accel_threshold_for_ignition_on
                    ),
                  accel_threshold_for_ignition_off:
                    BwsNb2Parser.accel_threshold_for_ignition_off(
                      read_accel_threshold_for_ignition_off
                    ),
                  accel_threshold_for_movement:
                    BwsNb2Parser.accel_threshold_for_movement(
                      read_accel_threshold_for_movement
                    ),
                  harsh_acceleration_threshold:
                    BwsNb2Parser.harsh_acceleration_threshold(
                      read_harsh_acceleration_threshold
                    ),
                  harsh_braking_threshold: BwsNb2Parser.harsh_braking_threshold(
                    read_harsh_braking_threshold
                  ),
                  full_configuration_table:
                    BwsNb2Parser.full_configuration_table(
                      read_full_configuration_table
                    ),
                  full_functionality_table:
                    BwsNb2Parser.full_functionality_table(
                      read_full_functionality_table
                    ),
                  sleep_mode: BwsNb2Parser.sleep_mode(read_sleep_mode),
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
                      transform: BwsNb2Parser.auto_test,
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
    async (port: ISerialPort, serial: string) => {
      const identification = await findOneSerial({ serial });
      if (!identification) {
        return { ok: false, port, error: "Serial não encontrado na base" };
      }

      const writeMessages = [
        {
          key: "serial",
          command: `WINS=${serial}\r\n`,
        },
        {
          key: "imei",
          command: `WIMEI=${identification.imei}\r\n`,
        },
      ] as const;

      const readMessages = [
        {
          key: "serial",
          command: `RINS\r\n`,
          transform: BwsNb2Parser.serial,
        },
        {
          key: "imei",
          command: `RIMEI\r\n`,
          transform: BwsNb2Parser.imei,
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
          !readResponse.imei ||
          !isImei(readResponse.imei) ||
          !readResponse.serial
        ) {
          return { ok: false, port, error: "IMEI ou Serial inválido" };
        }

        const status =
          identification.serial === readResponse.serial &&
          identification.imei === readResponse.imei;

        const end_time = Date.now();

        return {
          port,
          response: writeResponse,
          messages: writeMessages,
          init_time,
          end_time,
          status,
          ok: true,
          equipment: {
            serial: readResponse.serial,
            imei: readResponse.imei,
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

  const isIdentified = (input: {
    imei?: string;
    iccid?: string;
    serial?: string;
    firmware?: string;
  }): "fully_identified" | "partially_identified" | "not_identified" => {
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
    handleGetProfile,
    handleConfiguration,
    requestPort,
    handleAutoTest,
    handleDetection,
  };
};
