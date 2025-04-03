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

type DataTransmission = number;

type Odometer = number;

type KeepAlive = number;

type AccelerometerSensitivity = number;

type SensitivityAdjustment = number;

type EconomyMode = number;

type LBSPosition = boolean;

type CorneringPositionUpdate = boolean;

type IgnitionAlertPowerCut = boolean;

type GprsFailureAlert = boolean;

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
  t1: number;
  t2: number;
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
  economy_mode?: EconomyMode;
  lbs_position?: LBSPosition;
  cornering_position_update?: CorneringPositionUpdate;
  led?: Led;
  virtual_ignition?: VirtualIgnition;
  max_speed?: number;
  sensitivity_adjustment?: number;
  virtual_ignition_by_movement?: VirtualIgnitionByMovement;
  virtual_ignition_by_voltage?: VirtualIgnitionByVoltage;
  communication_type?: CommunicationType;
  protocol_type?: ProtocolType;
  anti_theft?: AntiTheft;
  jammer_detection?: JammerDetection;
  angle_adjustment?: AngleAdjustment;
  lock_type_progression?: LockTypeProgression;
  ignition_by_voltage?: IgnitionByVoltage;
  input_1?: number;
  input_2?: number;
  ack?: number;
}

interface Status {
  [key: string]: string;
}

export namespace E34G {
  export interface AutoTest {
    ACELC: string;
    ACELP: string;
    BATT_VOLT: string;
    CHARGER: string;
    FW: string;
    GPS: string;
    GPSf: string;
    GSM: string;
    IC: string;
    ID_ACEL: string;
    ID_MEM: string;
    IN1: string;
    IN2: string;
    LTE: string;
    OUT: string;
    SN: string;
    VCC: string;
    SIMHW: string;
    MEM: string;
  }
}

export class E34GParser {
  static check(input: string): Check | undefined {
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
          parsed["apn"] = E34GParser.apn(value);
        }
        if (key === "TZ") {
          parsed["timezone"] = E34GParser.timezone(value);
        }
        if (key === "OUT_MODE") {
          parsed["lock_type"] = E34GParser.lock_type(value);
        }
        if (key === "HB") {
          parsed["data_transmission_on"] =
            E34GParser.data_transmission_on(value);
          parsed["data_transmission_off"] =
            E34GParser.data_transmission_off(value);
        }
        if (key === "DK") {
          parsed["odometer"] = E34GParser.odometer(value);
        }
        if (key === "TX") {
          parsed["keep_alive"] = E34GParser.keep_alive(value);
        }
        if (key === "ZD") {
          parsed["accelerometer_sensitivity"] =
            E34GParser.accelerometer_sensitivity(value);
        }
        if (key === "SDMS") {
          parsed["economy_mode"] = E34GParser.economy_mode(value);
        }
        if (key === "LBS") {
          parsed["lbs_position"] = E34GParser.lbs_position(value);
        }
        if (key === "TUR") {
          parsed["cornering_position_update"] =
            E34GParser.cornering_position_update(value);
        }
        if (key === "LED") {
          parsed["led"] = E34GParser.led(value);
        }
        if (key === "IV") {
          parsed["virtual_ignition"] = E34GParser.virtual_ignition(value);
        }
        if (key === "OD") {
          parsed["max_speed"] = E34GParser.max_speed(value);
        }

        if (key === "ACCEL") {
          parsed["virtual_ignition_by_movement"] =
            E34GParser.virtual_ignition_by_movement(value);
        }

        if (key === "PROT_COM") {
          parsed["communication_type"] = E34GParser.communication_type(value);
        }

        if (key === "PROT") {
          parsed["protocol_type"] = E34GParser.protocol_type(value);
        }

        if (key === "AF") {
          parsed["anti_theft"] = E34GParser.anti_theft(value);
        }
        if (key === "JD") {
          parsed["jammer_detection"] = E34GParser.jammer_detection(value);
        }
        if (key === "TDET") {
          parsed["angle_adjustment"] = E34GParser.angle_adjustment(value);
        }
        if (key === "DC") {
          parsed["lock_type_progression"] =
            E34GParser.lock_type_progression(value);
        }
        if (key === "Voltage") {
          parsed["ignition_by_voltage"] = E34GParser.ignition_by_voltage(value);
        }
        if (key === "VOLTAGE") {
          parsed["virtual_ignition_by_voltage"] =
            E34GParser.virtual_ignition_by_voltage(value);
        }
        if (key === "IN1_MODE") {
          parsed["input_1"] = E34GParser.input_1(value);
        }
        if (key === "IN2_MODE") {
          parsed["input_2"] = E34GParser.input_2(value);
        }
        if (key === "GS") {
          parsed["sensitivity_adjustment"] =
            E34GParser.sensitivity_adjustment(value);
        }
        if (key === "ACK") {
          parsed["ack"] = E34GParser.ack(value);
        }
      });
    }
    return parsed;
  }

  static status(input: string) {
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

  static imei(input: string) {
    if (!input.includes("IMEI=")) return undefined;
    const imei = input.split("IMEI=")?.[1].replace(/\s+/g, "");
    return imei.length ? imei : undefined;
  }

  static iccid(input: string) {
    if (!input.includes("ICCID=")) return undefined;
    const iccid = input.split("ICCID=")?.[1].replace(/\s+/g, "");
    return iccid.length ? iccid : undefined;
  }

  static firmware(input: string) {
    if (!input.includes("BWSiot_E3+4G")) return undefined;
    return input;
  }

  /*
   * @example: www.bws.com,bws,bws
   */
  static apn(input: string): APN | undefined {
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
    let result: IP;
    const ips = input
      .replace(/\s+/g, "")
      .replace(/IP1=|IP2=/g, "")
      .split(";");
    const raw = ips?.[0];
    const [ip, port] = raw.split(",");
    result = { ip, port: Number(port) };
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /*
   * @example: IP1=161.35.12.221:5454 IP2=161.35.12.221:5454
   */
  static ip_secondary(input: string) {
    let result: IP;
    const ips = input
      .replace(/\s+/g, "")
      .replace(/IP1=|IP2=/g, "")
      .split(";");
    const raw = ips?.[1];
    const [ip, port] = raw.split(",");
    result = { ip, port: Number(port) };
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /*
   * @example: DNS=dns.com:2000
   */
  static dns(input: string): DNS | undefined {
    let result: DNS = {} as DNS;
    const regex = input
      .replace(/\s+/g, "")
      .replace(/IP1=|IP2=|DNS=/g, "")
      .split(";");
    const [address, port] = regex[2].split(",");
    if (address) {
      result["address"] = address;
    }
    if (port && !Number.isNaN(port)) {
      result["port"] = Number(port);
    }
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /*
   * @example E0 ou W3
   */
  static timezone(input: string): Timezone | undefined {
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
    if (["1", "2", "3"].every((el) => el !== input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30, 180
   */
  static data_transmission_on(input: string): DataTransmission | undefined {
    const [on, _] = input.split(",");
    if (!on) return undefined;
    if (Number.isNaN(on)) return undefined;
    return Number(on);
  }

  /*
   *@example 30, 180
   */
  static data_transmission_off(input: string): DataTransmission | undefined {
    const [_, off] = input.split(",");
    if (!off) return undefined;
    if (Number.isNaN(off)) return undefined;
    return Number(off);
  }

  /*
   *@example 4500
   */
  static odometer(input: string): Odometer | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30
   */
  static keep_alive(input: string): KeepAlive | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30
   */
  static accelerometer_sensitivity(
    input: string
  ): AccelerometerSensitivity | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   *@example 30
   */
  static economy_mode(input: string): EconomyMode | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   * @example 30
   */
  static lbs_position(input: string): LBSPosition | undefined {
    if (!input || (input !== "ON" && input !== "OFF")) return undefined;
    return input === "ON" ? true : false;
  }

  static cornering_position_update(
    input: string
  ): CorneringPositionUpdate | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static led(input: string): Led | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static virtual_ignition(input: string): VirtualIgnition | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static virtual_ignition_by_voltage(
    input: string
  ): VirtualIgnitionByVoltage | undefined {
    if (!input || (input !== "OFF" && input !== "ON")) return undefined;
    return input === "ON" ? true : false;
  }

  static sensitivity_adjustment(
    input: string
  ): SensitivityAdjustment | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static auto_test(input: string): E34G.AutoTest | undefined {
    if (!input.startsWith("SN:")) return undefined;
    const splited = input.split(",");
    return splited.reduce((acc, cur) => {
      const [key, value] = cur.split(":");
      acc[key as keyof E34G.AutoTest] = value;
      return acc;
    }, {} as E34G.AutoTest);
  }

  /*
   * @example 30
   */
  static max_speed(input: string): MaxSpeed | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static virtual_ignition_by_movement(
    input: string
  ): VirtualIgnitionByMovement | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static communication_type(input: string): CommunicationType | undefined {
    if (!input || (input !== "TCP" && input !== "UDP")) return undefined;
    return input;
  }

  static protocol_type(input: string): ProtocolType | undefined {
    if (!input || (input !== "E3+" && input !== "GT06")) return undefined;
    return input;
  }

  static anti_theft(input: string): AntiTheft | undefined {
    if (!input || (input !== "OFF" && input !== "ON")) return undefined;
    return input === "ON" ? true : false;
  }

  static jammer_detection(input: string): JammerDetection | undefined {
    if (!input || (input !== "0,0" && input !== "1,0")) return undefined;
    return input === "1,0" ? true : false;
  }

  static angle_adjustment(input: string): AngleAdjustment | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }
  static lock_type_progression(input: string): LockTypeProgression | undefined {
    const [n1, n2] = input.split(",");
    if (!n1 || !n2) return undefined;
    if (Number.isNaN(n1) || Number.isNaN(n2)) return undefined;
    return {
      n1: Number(n2),
      n2: Number(n1),
    };
  }
  static ignition_by_voltage(input: string): IgnitionByVoltage | undefined {
    const [t1, t2] = input.split(",");
    if (!t1 || !t2) return undefined;
    if (Number.isNaN(t1) || Number.isNaN(t2)) return undefined;
    return {
      t1: Number(t1),
      t2: Number(t2),
    };
  }

  static input_1(input: string): number | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static input_2(input: string): number | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  static horimeter(input: string): number | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   * @example 30
   */
  static ack(input: string): MaxSpeed | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }
}

// const check = "Sim=VAZIO SOS=PANIC APN=bws.br,bws,bws TZ=W0 HB=60,7200 MG=0 TX=300 BJ=0 ACCMODE=1 TDET=20 WKMODE=0 DD=0 OD=120 SDMS=2 TUR=1 PROT_COM=TCP DK=0 JD=1 LBS=ON OUT_MODE=2 LED=1 IV=1 ACC=1 GPRS=2G GPS=V PROT=E3+ DC=1500,8000 Voltage=13.50,12.50 AF=OFF GS=120 ACK=30 IN2_MODE=1 MQ=OFF

// const status = "BATTERY EXTERNAL:11.49V;BATT_INT:0%;ACC:ON;GPRS:Ok;GPS:0;GSM:20;HR: ;Buffer Memory:0;Tech:4G E_UTRAN;IP:143.198.247.1;Port:2000;ENGINE MODE1"

// const autotest SN:869671070546377,IC:89551805400523770076,FW:BWSiot_E3+4GW_V1.51 (DIV=100k+68k) (EG915U-LA) (Aug  9 2024 10:13:13),GPS:OK,GPSf:NOK,GSM:OK,LTE:OK,IN1:OK,IN2:NOK,OUT:NOK,ACELC:MC3632,ACELP:1,VCC:OK,CHARGER:OK,ID_ACEL:71,ID_MEM:C22536:BATT_VOLT:5.61V
