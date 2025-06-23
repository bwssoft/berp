type APN = {
  address: string;
  user: string;
  password: string;
};

type IP = {
  ip: string;
  port: string;
};

type DNS = {
  address: string;
  port: string;
};

type Voltage = {
  initial: string;
  final: string;
};

type Encoder =
  | { command: "apn"; args: APN }
  | { command: "ip_primary"; args: IP }
  | { command: "ip_secondary"; args: IP }
  | { command: "dns_primary"; args: DNS };

export class NB2Encoder {
  static data_transmission_on(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCN=${input}\r\n`;
  }

  static data_transmission_off(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCW=${input}\r\n`;
  }

  static keep_alive(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCK=${input}\r\n`;
  }

  static ip_primary(input: IP): string | undefined {
    if (!input.ip || typeof input.port !== "number") return undefined;
    return `WIP1=${input.ip}:${input.port}\r\n`;
  }

  static ip_secondary(input: IP): string | undefined {
    if (!input.ip || typeof input.port !== "number") return undefined;
    return `WIP2=${input.ip}:${input.port}\r\n`;
  }

  static dns_primary(input: DNS): string | undefined {
    if (!input.address || typeof input.port !== "number") return undefined;
    return `WID1=${input.address}:${input.port}\r\n`;
  }

  static dns_secondary(input: DNS): string | undefined {
    if (!input.address || typeof input.port !== "number") return undefined;
    return `WID2=${input.address}:${input.port}\r\n`;
  }

  static apn(input: APN): string | undefined {
    if (!input.address || !input.user) return undefined;
    return `WIAP=${input.address},${input.user},${input.password}\r\n`;
  }

  static data_transmission_event(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCE=${input}\r\n`;
  }

  static sleep(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCS=${input}\r\n`;
  }

  static odometer(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WODM=${input}\r\n`;
  }

  static virtual_ignition_12v(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return `WIG12=${input.initial},${input.final}\r\n`;
  }

  static virtual_ignition_24v(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return `WIG24=${input.initial},${input.final}\r\n`;
  }

  static heading_detection_angle(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFA=${input}\r\n`;
  }

  static speed_alert_threshold(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFV=${input}\r\n`;
  }

  static accel_threshold_for_ignition_on(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFTON=${input}\r\n`;
  }

  static accel_threshold_for_ignition_off(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFTOF=${input}\r\n`;
  }

  static accel_threshold_for_movement(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFAV=${input}\r\n`;
  }

  static harsh_acceleration_threshold(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFMA=${input}\r\n`;
  }
  static harsh_braking_threshold(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFMD=${input}\r\n`;
  }

  static input_1(input: number): string {
    return `WIN1=${input}`;
  }

  static input_2(input: number): string {
    return `WIN2=${input}`;
  }

  static input_3(input: number): string {
    return `WIN3=${input}`;
  }

  static input_4(input: number): string {
    return `WIN4=${input}`;
  }

  static serial(input: string): string | undefined {
    if (!input || typeof input !== "string") return undefined;
    return `WINS=${input}\r\n`;
  }

  static imei(input: string): string | undefined {
    if (!input || typeof input !== "string") return undefined;
    return `WIMEI=${input}\r\n`;
  }

  static commands() {
    return {
      serial: NB2Encoder.serial,
      imei: NB2Encoder.imei,
      odometer: NB2Encoder.odometer,
      data_transmission_on: NB2Encoder.data_transmission_on,
      data_transmission_off: NB2Encoder.data_transmission_off,
      data_transmission_event: NB2Encoder.data_transmission_event,
      sleep: NB2Encoder.sleep,
      keep_alive: NB2Encoder.keep_alive,
      ip_primary: NB2Encoder.ip_primary,
      ip_secondary: NB2Encoder.ip_secondary,
      dns_primary: NB2Encoder.dns_primary,
      dns_secondary: NB2Encoder.dns_secondary,
      apn: NB2Encoder.apn,
      virtual_ignition_12v: NB2Encoder.virtual_ignition_12v,
      virtual_ignition_24v: NB2Encoder.virtual_ignition_24v,
      heading_detection_angle: NB2Encoder.heading_detection_angle,
      speed_alert_threshold: NB2Encoder.speed_alert_threshold,
      accel_threshold_for_ignition_on:
        NB2Encoder.accel_threshold_for_ignition_on,
      accel_threshold_for_ignition_off:
        NB2Encoder.accel_threshold_for_ignition_off,
      accel_threshold_for_movement: NB2Encoder.accel_threshold_for_movement,
      harsh_acceleration_threshold: NB2Encoder.harsh_acceleration_threshold,
      harsh_braking_threshold: NB2Encoder.harsh_braking_threshold,
      input_1: NB2Encoder.input_1,
      input_2: NB2Encoder.input_2,
      input_3: NB2Encoder.input_3,
      input_4: NB2Encoder.input_4,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = NB2Encoder.commands();
    return commands[command](args as any);
  }
}
