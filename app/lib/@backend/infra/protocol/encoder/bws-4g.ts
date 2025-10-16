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

type Password = {
  old: string;
  new: string;
};

type DataTransmission = number;

type Timezone = number;

type LockTypeProgression = {
  n1: number;
  n2: number;
};

type IgnitionByVoltage = {
  initial: number;
  final: number;
};

type Encoder =
  | { command: "apn"; args: APN }
  | { command: "ip_primary"; args: IP }
  | { command: "ip_secondary"; args: IP }
  | { command: "dns_primary"; args: DNS };

export class BWS4GEncoder {
  //comands
  static apn(props: APN): string | undefined {
    if (!props?.address) {
      return undefined;
    }
    return `APN*${props.address}*${props.user ?? ""}*${props.password ?? ""}`;
  }

  static ip_primary(props: IP): string | undefined {
    if (!props?.ip || !props?.port) return undefined;
    return `IP1#${props.ip}#${props.port}#`;
  }

  static ip_secondary(props: IP): string | undefined {
    if (!props?.ip || !props?.port) return undefined;
    return `IP2#${props.ip}#${props.port}#`;
  }

  static dns_primary(props: DNS): string | undefined {
    if (!props?.address || !props?.port) {
      return undefined;
    }
    return `DNS1#${props.address}#${props.port}#`;
  }

  static dns_secondary(props: DNS): string | undefined {
    if (!props?.address || !props?.port) {
      return undefined;
    }
    return `DNS2#${props.address}#${props.port}#`;
  }

  static password(props: Password): string | undefined {
    if (!props?.old || !props?.new) {
      return undefined;
    }
    return `MODIFYPW${props.old}${props.new}`;
  }

  static timezone(props: Timezone): string | undefined {
    if (typeof props !== "number") return undefined;
    if (props < 0) {
      return `TZW${props * -1}`;
    }
    return `TZE${props}`;
  }

  static lock_type(props: number): string | undefined {
    if (typeof props !== "number" || [30, 31, 1, 2].every((v) => v !== props)) {
      return undefined;
    }
    return `MODE${props}`;
  }

  static data_transmission_on(props: DataTransmission): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props)) return undefined;
    return `HB${props}`;
  }

  static data_transmission_off(props: DataTransmission): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props)) return undefined;
    return `SHB${props}`;
  }

  static odometer(props: number): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props) || props === 0) {
      return undefined;
    }
    return `DK${props}`;
  }

  static keep_alive(props: number): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props) || props === 0) {
      return undefined;
    }
    return `TX${props}`;
  }

  static accelerometer_sensitivity(props: number): string | undefined {
    if (
      typeof props !== "number" ||
      Number.isNaN(props) ||
      props < 0 ||
      props > 10
    ) {
      return undefined;
    }
    return `SENSE${props}`;
  }

  static sensitivity_adjustment(props: number): string | undefined {
    if (
      typeof props !== "number" ||
      Number.isNaN(props) ||
      props < 60 ||
      props > 2000
    ) {
      return undefined;
    }
    return `GS${props}`;
  }

  static lbs_position(props: boolean): string | undefined {
    if (typeof props !== "boolean") {
      return undefined;
    }
    return `LBS${props ? "ON" : "OFF"}`;
  }

  static led(props: boolean): string | undefined {
    if (typeof props !== "boolean") {
      return undefined;
    }
    return `LED${props ? "ON" : "OFF"}`;
  }

  static communication_type(props: string): string | undefined {
    if (!["TCP"].includes(props)) {
      return undefined;
    }
    return props;
  }

  static protocol_type(props: string): string | undefined {
    if (!["E3+"].includes(props)) {
      return undefined;
    }
    return `CHGPROT${props}`;
  }

  static anti_theft(props: boolean): string | undefined {
    if (typeof props !== "boolean") {
      return undefined;
    }
    return `AF${props ? "ON" : "OFF"}`;
  }

  static horimeter(props: number): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props) || props === 0) {
      return undefined;
    }
    return `HR${props}`;
  }

  static jammer_detection(props: boolean): string | undefined {
    if (typeof props !== "boolean") {
      return undefined;
    }
    return `JD${props ? 1 : 0}`;
  }

  static clear_buffer(props: boolean): string | undefined {
    if (typeof props !== "boolean" || props === false) {
      return undefined;
    }
    return "CLEARBUFFER";
  }

  static clear_horimeter(props: boolean): string | undefined {
    if (typeof props !== "boolean" || props === false) {
      return undefined;
    }
    return "CLEARHORIMETER";
  }

  static input_1(props: number): string | undefined {
    if (props !== 1 && props !== 2) {
      return undefined;
    }
    if (props === 1) {
      return "MASTER1";
    }
    if (props === 2) {
      return "SLAVE1";
    }
    return undefined;
  }

  static input_2(props: number): string | undefined {
    if (props !== 1 && props !== 2 && props !== 3) {
      return undefined;
    }
    if (props === 1) {
      return "MASTER2";
    }
    if (props === 2) {
      return "SLAVE2";
    }
    if (props === 3) {
      return "NEGATIVE2";
    }
    return undefined;
  }

  static angle_adjustment(props: number): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props)) {
      return undefined;
    }
    return `TDET${props}`;
  }

  static lock_type_progression(props: LockTypeProgression): string | undefined {
    if (!props?.n1 || !props?.n2) {
      return undefined;
    }
    return `DC*${props.n1}*${props.n2}`;
  }

  static ignition_by_voltage(props: IgnitionByVoltage): string | undefined {
    if (!props?.initial || !props?.final) {
      return undefined;
    }
    return `VOLTAGE*${props.initial}*${props.final}`;
  }

  static max_speed(props: number): string | undefined {
    if (typeof props !== "number" || Number.isNaN(props)) {
      return undefined;
    }
    return `SPEED${props}`;
  }

  static ignition_status_hb(props: boolean): string | undefined {
    if (typeof props !== "boolean") {
      return undefined;
    }
    return `ISHB${props ? "ON" : "OFF"}`;
  }

  static commands() {
    return {
      apn: BWS4GEncoder.apn,
      ip_primary: BWS4GEncoder.ip_primary,
      ip_secondary: BWS4GEncoder.ip_secondary,
      dns_primary: BWS4GEncoder.dns_primary,
      password: BWS4GEncoder.password,
      timezone: BWS4GEncoder.timezone,
      lock_type: BWS4GEncoder.lock_type,
      data_transmission_on: BWS4GEncoder.data_transmission_on,
      data_transmission_off: BWS4GEncoder.data_transmission_off,
      odometer: BWS4GEncoder.odometer,
      keep_alive: BWS4GEncoder.keep_alive,
      accelerometer_sensitivity: BWS4GEncoder.accelerometer_sensitivity,
      sensitivity_adjustment: BWS4GEncoder.sensitivity_adjustment,
      lbs_position: BWS4GEncoder.lbs_position,
      led: BWS4GEncoder.led,
      communication_type: BWS4GEncoder.communication_type,
      protocol_type: BWS4GEncoder.protocol_type,
      anti_theft: BWS4GEncoder.anti_theft,
      horimeter: BWS4GEncoder.horimeter,
      jammer_detection: BWS4GEncoder.jammer_detection,
      clear_buffer: BWS4GEncoder.clear_buffer,
      clear_horimeter: BWS4GEncoder.clear_horimeter,
      input_1: BWS4GEncoder.input_1,
      input_2: BWS4GEncoder.input_2,
      angle_adjustment: BWS4GEncoder.angle_adjustment,
      lock_type_progression: BWS4GEncoder.lock_type_progression,
      ignition_by_voltage: BWS4GEncoder.ignition_by_voltage,
      max_speed: BWS4GEncoder.max_speed,
      ignition_status_hb: BWS4GEncoder.ignition_status_hb,
    };
  }

  static encoder(props: Encoder): string | undefined {
    const { command, args } = props;
    const commands = BWS4GEncoder.commands();
    return commands[command](args as any);
  }
}

// const status = "BATTERY EXTERNAL:11.49V;BATT_INT:0%;ACC:ON;GPRS:Ok;GPS:0;GSM:20;HR: ;Buffer Memory:0;Tech:4G E_UTRAN;IP:143.198.247.1;Port:2000;ENGINE MODE1"

// const check =  "Sim=VAZIO SOS=PANIC APN=bws.br,bws,bws TZ=W0 HB=60,7200 MG=0 TX=300 BJ=0 ACCMODE=1 TDET=20 WKMODE=0 DD=0 OD=120 SDMS=2 TUR=1 PROT_COM=TCP DK=0 JD=1 LBS=ON OUT_MODE=2 LED=1 IV=1 ACC=1 GPRS=2G GPS=V PROT=E3+ DC=1500,8000 Voltage=13.50,12.50 AF=OFF GS=120 ACK=30 IN2_MODE=1 MQ=OFF"
