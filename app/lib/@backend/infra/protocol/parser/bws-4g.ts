type APN = {
  address: string;
  user: string;
  password?: string;
};

type IP = {
  ip: string;
  port: number;
};

type DNS = {
  address: string;
  port: number;
};

type Timezone = number;

type Locktype = number;

type LocktypeVariation = number;

type DataTransmission = number;

type Odometer = number;

type KeepAlive = number;

type AccelerometerSensitivity = number;

type SensitivityAdjustment = number;

type LBSPosition = boolean;

type CorneringPositionUpdate = boolean;

type Led = boolean;

type VirtualIgnition = boolean;

type VirtualIgnitionByVoltage = boolean;

type VirtualIgnitionByMovement = boolean;

type MaxSpeed = number;

type CommunicationType = "TCP" | "UDP";

type ProtocolType = "E3+" | "GT06";

type AntiTheft = boolean;

type JammerDetection = boolean;

type AngleAdjustment = number;

type LockTypeProgression = {
  n1: number;
  n2: number;
};

type IgnitionByVoltage = {
  initial: number;
  final: number;
};

interface Check extends Object {
  apn?: APN;
  timezone?: Timezone;
  lock_type?: Locktype;
  data_transmission_on?: DataTransmission;
  data_transmission_off?: DataTransmission;
  odometer?: Odometer;
  keep_alive?: KeepAlive;
  accelerometer_sensitivity?: AccelerometerSensitivity;
  lbs_position?: LBSPosition;
  led?: Led;
  max_speed?: number;
  sensitivity_adjustment?: number;
  communication_type?: CommunicationType;
  protocol_type?: ProtocolType;
  anti_theft?: AntiTheft;
  jammer_detection?: JammerDetection;
  angle_adjustment?: AngleAdjustment;
  input_1?: number;
  input_2?: number;
}

interface Status {
  [key: string]: string;
}

export namespace Bws4g {
  export interface AutoTest {
    DEV: string; //DM_BWS_4G,
    SN: string; //99101210,
    IC: string; //89555480000070821034,
    IM: string; //860710052284208,
    FW: string; //BWSiot_E3+4G_SC_V0.0.34 (MASA) (Jun 30 2025 14:11:23),
    GPS: string; //OK,
    GPSf: string; //NOK,
    MDM: string; //OK,
    RSI: string; //OK,
    IN1: string; //NOK,
    IN2: string; //NOK,
    OUT: string; //NOK,
    ACELC: string; //STK8321,
    ACELP: string; //OK,
    ID_ACEL: string; //35,
    ID_MEM: string; //000,
    VCC: string; //1353,
    BATT_VOLT: string; //415,
    CHARGER: string; //OK,
    TEMP: string; //25
  }
}

export class Bws4gParser {
  static check(input: string): Check | undefined {
    if (typeof input !== "string") return undefined;

    if (typeof input !== "string") return undefined;
    let parsed: Check = {};
    const obj: Record<string, string> = {};
    const regex = /(\w+[:=][^ ]+)/g;
    const matches = input.match(regex);

    if (matches) {
      matches.forEach((pair) => {
        let key: string | undefined;
        let value: string | undefined;

        if (pair.includes("=")) {
          [key, value] = pair.split("=");
        } else if (pair.includes(":")) {
          [key, value] = pair.split(":");
        }

        if (key && value !== undefined) {
          obj[key.trim()] = value.trim();
        }
      });
    }

    if (Object.keys(obj).length > 0) {
      Object.entries(obj).forEach((entrie) => {
        const [key, value] = entrie;
        if (key === "APN") {
          parsed["apn"] = Bws4gParser.apn(value);
        }
        if (key === "TZ") {
          parsed["timezone"] = Bws4gParser.timezone(value);
        }
        if (key === "OUT_MODE") {
          parsed["lock_type"] = Bws4gParser.lock_type(value);
        }
        if (key === "HB") {
          parsed["data_transmission_on"] =
            Bws4gParser.data_transmission_on(value);
          parsed["data_transmission_off"] =
            Bws4gParser.data_transmission_off(value);
        }
        if (key === "DK") {
          parsed["odometer"] = Bws4gParser.odometer(value);
        }
        if (key === "TX") {
          parsed["keep_alive"] = Bws4gParser.keep_alive(value);
        }
        if (key === "ZD") {
          parsed["accelerometer_sensitivity"] =
            Bws4gParser.accelerometer_sensitivity(value);
        }
        if (key === "LBS") {
          parsed["lbs_position"] = Bws4gParser.lbs_position(value);
        }
        if (key === "LED") {
          parsed["led"] = Bws4gParser.led(value);
        }

        if (key === "OD") {
          parsed["max_speed"] = Bws4gParser.max_speed(value);
        }

        if (key === "PROT_COM") {
          parsed["communication_type"] = Bws4gParser.communication_type(value);
        }

        if (key === "PROT") {
          parsed["protocol_type"] = Bws4gParser.protocol_type(value);
        }

        if (key === "AF") {
          parsed["anti_theft"] = Bws4gParser.anti_theft(value);
        }
        if (key === "JD") {
          parsed["jammer_detection"] = Bws4gParser.jammer_detection(value);
        }
        if (key === "TDET") {
          parsed["angle_adjustment"] = Bws4gParser.angle_adjustment(value);
        }
        if (key === "IN1_MODE") {
          parsed["input_1"] = Bws4gParser.input_1(value);
        }
        if (key === "IN2_MODE") {
          parsed["input_2"] = Bws4gParser.input_2(value);
        }
        if (key === "GS") {
          parsed["sensitivity_adjustment"] =
            Bws4gParser.sensitivity_adjustment(value);
        }
      });
    }
    return parsed;
  }

  static status(input: string) {
    if (typeof input !== "string") return undefined;
    const obj: Status = {};
    const keyValuePairs = input.split(";");

    keyValuePairs.forEach((pair) => {
      let key: string | undefined;
      let value: string | undefined;

      if (pair.includes(":")) {
        [key, value] = pair.split(":");
      }

      if (key && value !== undefined) {
        obj[key.trim()] = value.trim();
      }
    });

    return obj;
  }

  static serial(input: string): string | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("RINS=");

    if (parts.length < 2) return undefined;

    const serialValue = parts[1].trim();

    const value = serialValue.replace(/\s+/g, "");

    return value.length ? value.padStart(8, "0") : undefined;
  }

  static imei(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("IMEI=")) return undefined;
    const imei = input.split("IMEI=")?.[1].replace(/\s+/g, "");
    return imei.length ? imei : undefined;
  }

  static iccid(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("ICCID=")) return undefined;
    const iccid = input.split("ICCID=")?.[1].replace(/\s+/g, "");
    return iccid.length ? iccid : undefined;
  }

  static firmware(input: string) {
    if (typeof input !== "string") return undefined;
    if (!input.includes("BWS4G_SC")) return undefined;
    return input;
  }

  /*
   * @example: www.bws.com,bws,bws
   */
  static apn(input: string): APN | undefined {
    if (typeof input !== "string") return undefined;

    const [address, user, password] = input.split(",");
    if (!address || !user) {
      return undefined;
    }
    return {
      address,
      user,
      password,
    };
  }

  /*
   * @example: IP1=161.35.12.221:5454 IP2=161.35.12.221:5454
   */
  static ip_primary(input: string) {
    if (typeof input !== "string") return undefined;

    let result: IP;
    const ips = input
      .replace(/\s+/g, "")
      .replace(/IP1=|IP2=/g, "")
      .split(";");
    const raw = ips?.[0];
    if (!raw) return undefined;
    const [ip, port] = raw.split(",");
    result = { ip, port: Number(port) };
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /*
   * @example: IP1=161.35.12.221:5454 IP2=161.35.12.221:5454
   */
  static ip_secondary(input: string) {
    if (typeof input !== "string") return undefined;

    let result: IP;
    const ips = input
      .replace(/\s+/g, "")
      .replace(/IP1=|IP2=/g, "")
      .split(";");
    const raw = ips?.[1];
    if (!raw) return undefined;
    const [ip, port] = raw.split(",");
    result = { ip, port: Number(port) };
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /**
   * Extrai o valor do dns primário de uma string que contém "DNS1=gw.dev.bws-infra.com,7001"
   *
   * @param input - A string que contém a informação do dns primário.
   * @returns O valor numérico do dns primário ou undefined se o formato não for válido.
   */
  static dns_primary(input: string) {
    if (typeof input !== "string") return undefined;

    const match = input.match(/IP1=([^\s;]+)/);
    if (!match) return undefined;

    const [address, port] = match[1].split(/[:,]/);
    if (!address || !port) return undefined;

    const parsedPort = Number(port);
    if (Number.isNaN(parsedPort)) return undefined;

    return {
      address,
      port: parsedPort,
    };
  }
  /**
   * Extrai o valor do dns secundário de uma string que contém "RID2=gw.bws-infra.com:7001"
   *
   * @param input - A string que contém a informação do dns secundário.
   * @returns O valor numérico do dns secundário ou undefined se o formato não for válido.
   */
  static dns_secondary(input: string) {
    if (typeof input !== "string") return undefined;

    const match = input.match(/IP2=([^\s;]+)/);
    if (!match) return undefined;

    const [address, port] = match[1].split(/[:,]/);
    if (!address || !port) return undefined;

    const parsedPort = Number(port);
    if (Number.isNaN(parsedPort)) return undefined;

    return {
      address,
      port: parsedPort,
    };
  }

  /*
   * @example E0 ou W3
   */
  static timezone(input: string): Timezone | undefined {
    if (typeof input !== "string") return undefined;

    const east = input.includes("E");
    if (east) {
      const value = input.split("E")?.[1];
      if (value) {
        return Number(value);
      }
    } else {
      const value = input.split("W")?.[1];
      if (value) {
        return Number(value) * -1;
      }
    }
  }

  /*
   * @example 1 ou 2 ou 3
   * tipo do bloqueio
   */
  static lock_type(input: string): Locktype | undefined {
    if (typeof input !== "string") return undefined;

    if (input === "PROG DIR") return 30;
    if (input === "PROG INV") return 31;

    return undefined;
  }

  /*
   * @example 1 ou 2 ou 3
   * tipo do bloqueio
   */
  static lock_type_variation(input: string): LocktypeVariation | undefined {
    const _input = Number(input);
    if (typeof input !== "string" || [1, 2].every((i) => _input !== i))
      return undefined;

    return isNaN(_input) ? undefined : _input;
  }

  /*
   *@example 30, 180
   */
  static data_transmission_on(input: string): DataTransmission | undefined {
    if (typeof input !== "string") return undefined;

    const [on, _] = input.split(",");
    if (!on) return undefined;
    if (Number.isNaN(on)) return undefined;
    return Number(on);
  }

  /*
   *@example 30, 180
   */
  static data_transmission_off(input: string): DataTransmission | undefined {
    if (typeof input !== "string") return undefined;

    const [_, off] = input.split(",");
    if (!off) return undefined;
    if (Number.isNaN(off)) return undefined;
    return Number(off);
  }

  /*
   *@example 4500
   */
  static odometer(input: string): Odometer | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30
   */
  static keep_alive(input: string): KeepAlive | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30
   */
  static accelerometer_sensitivity(
    input: string
  ): AccelerometerSensitivity | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   * @example 30
   */
  static lbs_position(input: string): LBSPosition | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "ON" && input !== "OFF")) return undefined;
    return input === "ON" ? true : false;
  }

  static cornering_position_update(
    input: string
  ): CorneringPositionUpdate | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static led(input: string): Led | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static sensitivity_adjustment(
    input: string
  ): SensitivityAdjustment | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static auto_test(input: string): Bws4g.AutoTest | undefined {
    if (typeof input !== "string") return undefined;
    const parts = input.split("AUTOTEST=");
    if (parts.length < 2) return undefined;
    const splited = parts[1].split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof Bws4g.AutoTest] = value;
      return acc;
    }, {} as Bws4g.AutoTest);
  }

  /*
   * @example 30
   */
  static max_speed(input: string): MaxSpeed | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static virtual_ignition_by_movement(
    input: string
  ): VirtualIgnitionByMovement | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static communication_type(input: string): CommunicationType | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || input !== "TCP") return undefined;
    return input;
  }

  static protocol_type(input: string): ProtocolType | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || input !== "E3+") return undefined;
    return input;
  }

  static anti_theft(input: string): AntiTheft | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "OFF" && input !== "ON")) return undefined;
    return input === "ON" ? true : false;
  }

  static jammer_detection(input: string): JammerDetection | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || (input !== "0,0" && input !== "1,0")) return undefined;
    return input === "1,0" ? true : false;
  }

  static angle_adjustment(input: string): AngleAdjustment | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }
  static ignition_by_voltage(input: string): IgnitionByVoltage | undefined {
    if (typeof input !== "string") return undefined;

    const [initial, final] = input.split(",");
    if (!initial || !final) return undefined;
    if (Number.isNaN(initial) || Number.isNaN(final)) return undefined;
    return {
      initial: Number(initial),
      final: Number(final),
    };
  }

  static input_1(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static input_2(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static horimeter(input: string): number | undefined {
    if (typeof input !== "string") return undefined;

    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static methods() {
    return {
      check: this.check,
      status: this.status,
      serial: this.serial,
      imei: this.imei,
      iccid: this.iccid,
      firmware: this.firmware,
      apn: this.apn,
      ip_primary: this.ip_primary,
      ip_secondary: this.ip_secondary,
      dns_primary: this.dns_primary,
      dns_secondary: this.dns_secondary,
      timezone: this.timezone,
      lock_type: this.lock_type,
      lock_type_variation: this.lock_type_variation,
      data_transmission_on: this.data_transmission_on,
      data_transmission_off: this.data_transmission_off,
      odometer: this.odometer,
      keep_alive: this.keep_alive,
      accelerometer_sensitivity: this.accelerometer_sensitivity,
      lbs_position: this.lbs_position,
      cornering_position_update: this.cornering_position_update,
      led: this.led,
      sensitivity_adjustment: this.sensitivity_adjustment,
      auto_test: this.auto_test,
      max_speed: this.max_speed,
      virtual_ignition_by_movement: this.virtual_ignition_by_movement,
      communication_type: this.communication_type,
      protocol_type: this.protocol_type,
      anti_theft: this.anti_theft,
      jammer_detection: this.jammer_detection,
      angle_adjustment: this.angle_adjustment,
      ignition_by_voltage: this.ignition_by_voltage,
      input_1: this.input_1,
      input_2: this.input_2,
      horimeter: this.horimeter,
    };
  }

  static parser<K extends keyof ReturnType<typeof Bws4gParser.methods>>(
    input: string[],
    ...keys: K[]
  ): { [P in K]?: ReturnType<ReturnType<typeof Bws4gParser.methods>[P]> } {
    const table = this.methods();
    const out = {} as {
      [P in K]?: ReturnType<ReturnType<typeof Bws4gParser.methods>[P]>;
    };

    for (const key of keys) {
      const fn = table[key as keyof typeof table] as (line: string) => any; // cada parser: (string) => T | undefined
      // chame a função explicitamente; se quiser garantir 'this', use call
      out[key] = input
        .map((line) => fn.call(this, line))
        .find((v) => v !== undefined);
    }
    return out;
  }
}

// const check = "Sim=VAZIO SOS=PANIC APN=bws.br,bws,bws TZ=W0 HB=60,7200 MG=0 TX=300 BJ=0 ACCMODE=1 TDET=20 WKMODE=0 DD=0 OD=120 SDMS=2 TUR=1 PROT_COM=TCP DK=0 JD=1 LBS=ON OUT_MODE=2 LED=1 IV=1 ACC=1 GPRS=2G GPS=V PROT=E3+ DC=1500,8000 Voltage=13.50,12.50 AF=OFF GS=120 ACK=30 IN2_MODE=1 MQ=OFF

// const status = "BATTERY EXTERNAL:11.49V;BATT_INT:0%;ACC:ON;GPRS:Ok;GPS:0;GSM:20;HR: ;Buffer Memory:0;Tech:4G E_UTRAN;IP:143.198.247.1;Port:2000;ENGINE MODE1"

// const autotest SN:869671070546377,IC:89551805400523770076,FW:BWSiot_E3+4GW_V1.51 (DIV=100k+68k) (EG915U-LA) (Aug  9 2024 10:13:13),GPS:OK,GPSf:NOK,GSM:OK,LTE:OK,IN1:OK,IN2:NOK,OUT:NOK,ACELC:MC3632,ACELP:1,VCC:OK,CHARGER:OK,ID_ACEL:71,ID_MEM:C22536:BATT_VOLT:5.61V
