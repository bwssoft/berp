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

export class BWS4GEncoder {
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

  static first_voltage(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return `WIG12=${input.initial},${input.final}\r\n`;
  }

  static second_voltage(input: Voltage): string | undefined {
    if (typeof input.initial !== "number" || typeof input.final !== "number")
      return `WIG24=${input.initial},${input.final}\r\n`;
  }

  static angle(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFA=${input}\r\n`;
  }

  static speed(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFV=${input}\r\n`;
  }

  static accelerometer_sensitivity_on(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFTON=${input}\r\n`;
  }

  static accelerometer_sensitivity_off(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFTOF=${input}\r\n`;
  }

  static accelerometer_sensitivity_violated(input: number): string | undefined {
    if (typeof input !== "number") return undefined;
    return `WFAV=${input}\r\n`;
  }

  static commands() {
    return {
      serial: BWS4GEncoder.serial,
      imei: BWS4GEncoder.imei,
      odometer: BWS4GEncoder.odometer,
      data_transmission_on: BWS4GEncoder.data_transmission_on,
      data_transmission_off: BWS4GEncoder.data_transmission_off,
      data_transmission_event: BWS4GEncoder.data_transmission_event,
      sleep: BWS4GEncoder.sleep,
      keep_alive: BWS4GEncoder.keep_alive,
      ip_primary: BWS4GEncoder.ip_primary,
      ip_secondary: BWS4GEncoder.ip_secondary,
      dns_primary: BWS4GEncoder.dns_primary,
      dns_secondary: BWS4GEncoder.dns_secondary,
      apn: BWS4GEncoder.apn,
      first_voltage: BWS4GEncoder.first_voltage,
      second_voltage: BWS4GEncoder.second_voltage,
      angle: BWS4GEncoder.angle,
      speed: BWS4GEncoder.speed,
      accelerometer_sensitivity_on: BWS4GEncoder.accelerometer_sensitivity_on,
      accelerometer_sensitivity_off: BWS4GEncoder.accelerometer_sensitivity_off,
      accelerometer_sensitivity_violated:
        BWS4GEncoder.accelerometer_sensitivity_violated,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = BWS4GEncoder.commands();
    return commands[command](args as any);
  }
}
