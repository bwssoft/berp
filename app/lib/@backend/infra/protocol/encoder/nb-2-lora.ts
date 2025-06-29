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

export class BwsNb2LoraEncoder {
  static serial(input: string): string | undefined {
    if (!input || typeof input !== "string") return undefined;
    return `WINS=${input}\r\n`;
  }

  static imei(input: string): string | undefined {
    if (!input || typeof input !== "string") return undefined;
    return `WIMEI=${input}\r\n`;
  }

  static odometer(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WODM=${input}\r\n`;
  }

  static data_transmission_on(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCN=${input}\r\n`;
  }

  static data_transmission_off(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCW=${input}\r\n`;
  }

  static data_transmission_event(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCE=${input}\r\n`;
  }

  static sleep(input: number): string | undefined {
    if (!input || typeof input !== "number") return undefined;
    return `WCS=${input}\r\n`;
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

  static virtual_ignition_12v(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return undefined;
    return `WIG12=${input.initial},${input.final}\r\n`;
  }

  static virtual_ignition_24v(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return undefined;
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

  static commands() {
    return {
      serial: BwsNb2LoraEncoder.serial,
      imei: BwsNb2LoraEncoder.imei,
      odometer: BwsNb2LoraEncoder.odometer,
      data_transmission_on: BwsNb2LoraEncoder.data_transmission_on,
      data_transmission_off: BwsNb2LoraEncoder.data_transmission_off,
      data_transmission_event: BwsNb2LoraEncoder.data_transmission_event,
      sleep: BwsNb2LoraEncoder.sleep,
      keep_alive: BwsNb2LoraEncoder.keep_alive,
      ip_primary: BwsNb2LoraEncoder.ip_primary,
      ip_secondary: BwsNb2LoraEncoder.ip_secondary,
      dns_primary: BwsNb2LoraEncoder.dns_primary,
      dns_secondary: BwsNb2LoraEncoder.dns_secondary,
      apn: BwsNb2LoraEncoder.apn,
      virtual_ignition_12v: BwsNb2LoraEncoder.virtual_ignition_12v,
      virtual_ignition_24v: BwsNb2LoraEncoder.virtual_ignition_24v,
      heading_detection_angle: BwsNb2LoraEncoder.heading_detection_angle,
      speed_alert_threshold: BwsNb2LoraEncoder.speed_alert_threshold,
      accel_threshold_for_ignition_on:
        BwsNb2LoraEncoder.accel_threshold_for_ignition_on,
      accel_threshold_for_ignition_off:
        BwsNb2LoraEncoder.accel_threshold_for_ignition_off,
      accel_threshold_for_movement:
        BwsNb2LoraEncoder.accel_threshold_for_movement,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = BwsNb2LoraEncoder.commands();
    return commands[command](args as any);
  }
}
