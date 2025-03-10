type APN = {
  address?: string;
  user?: string;
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

type DataTransmission = number

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

type PanicButton = boolean;

type WorkMode = string;

type OperationMode = boolean;

type MaxSpeed = number;

type Sleep = number;

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
  ignition_alert_power_cut?: IgnitionAlertPowerCut;
  gprs_failure_alert?: GprsFailureAlert;
  led?: Led;
  virtual_ignition?: VirtualIgnition;
  panic_button?: PanicButton;
  work_mode?: WorkMode;
  operation_mode?: OperationMode;
  sleep?: Sleep;
  max_speed?: MaxSpeed;
}

interface Status {
  [key: string]: string;
}

export class E3Parser {
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
          parsed["apn"] = this.apn(value);
        }
        if (key === "TZ") {
          parsed["timezone"] = this.timezone(value);
        }
        if (key === "MODE") {
          parsed["lock_type"] = this.lock_type(value);
        }
        if (key === "HB") {
          parsed["data_transmission_on"] = this.data_transmission_on(value);
          parsed["data_transmission_off"] = this.data_transmission_off(value);
        }
        if (key === "DK") {
          parsed["odometer"] = this.odometer(value);
        }
        if (key === "TX") {
          parsed["keep_alive"] = this.keep_alive(value);
        }
        if (key === "ZD") {
          parsed["accelerometer_sensitivity"] =
            this.accelerometer_sensitivity(value);
        }
        if (key === "SDMS") {
          parsed["economy_mode"] = this.economy_mode(value);
        }
        if (key === "LBS") {
          parsed["lbs_position"] = this.lbs_position(value);
        }
        if (key === "TUR") {
          parsed["cornering_position_update"] =
            this.cornering_position_update(value);
        }
        if (key === "BJ") {
          parsed["ignition_alert_power_cut"] =
            this.ignition_alert_power_cut(value);
        }
        if (key === "JD") {
          parsed["gprs_failure_alert"] = this.gprs_failure_alert(value);
        }
        if (key === "LED") {
          parsed["led"] = this.led(value);
        }
        if (key === "IV") {
          parsed["virtual_ignition"] = this.virtual_ignition(value);
        }
        if (key === "ACCMODE") {
          parsed["work_mode"] = this.work_mode(value);
        }
        if (key === "WKMODE") {
          parsed["operation_mode"] = this.operation_mode(value);
        }
        if (key === "AC") {
          parsed["sleep"] = this.sleep(value);
        }
        if (key === "OD") {
          parsed["max_speed"] = this.max_speed(value);
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
    return input.split("IMEI=")?.[1].trim() ?? undefined;
  }

  static iccid(input: string) {
    if (!input.includes("ICCID=")) return undefined;
    return input.split("ICCID=")?.[1].trim() ?? undefined;
  }

  static et(input: string) {
    if (!input.includes("<VER:")) return undefined;
    return input;
  }

  /*
   * @example: www.bws.com,bws,bws
   */
  static apn(input: string): APN | undefined {
    const [address, user, password] = input.split(",");
    if (!address) {
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
    result = { ip, port: Number(port) }
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
    result = { ip, port: Number(port) }
    if (Object.keys(result).length === 0) return undefined;
    return result;
  }

  /*
   * @example: DNS=dns.com:2000
   */
  static dns(input: string): DNS | undefined {
    let result: DNS = {} as DNS;
    const dns = input.replace(/DNS=/g, "").split(":");
    const address = dns?.[0];
    const port = dns?.[1];
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
    return Number(on)
  }
  
  /*
   *@example 30, 180
   */
  static data_transmission_off(input: string): DataTransmission | undefined {
    const [_, off] = input.split(",");
    if (!off) return undefined;
    if (Number.isNaN(off)) return undefined;
    return Number(off)
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
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static cornering_position_update(
    input: string
  ): CorneringPositionUpdate | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static ignition_alert_power_cut(
    input: string
  ): IgnitionAlertPowerCut | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static gprs_failure_alert(input: string): GprsFailureAlert | undefined {
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

  static work_mode(input: string): WorkMode | undefined {
    if (!input || !["SLAVE", "MASTER", "NEGATIVE"].includes(input)) {
      return undefined;
    }
    return input;
  }

  static operation_mode(input: string): OperationMode | undefined {
    if (!input || (input !== "1" && input !== "0")) return undefined;
    return input === "1" ? true : false;
  }

  static sensitivity_adjustment(
    input: string
  ): SensitivityAdjustment | undefined {
    if (!input.includes("GS:")) return undefined;
    let gs = input.split("GS:")?.[1];
    gs = gs.split(",")?.[0];
    if (Number.isNaN(gs)) return undefined;
    return Number(gs);
  }

  /*
   * @example 30
   */
  static max_speed(input: string): MaxSpeed | undefined {
    if (!input || Number.isNaN(input)) return undefined;
    return Number(input);
  }

  /*
   * @example 0,0
   */
  static sleep(input: string): Sleep | undefined {
    const [sleep, _] = input.split(",");
    if (!sleep || Number.isNaN(sleep)) return undefined;
    return Number(sleep);
  }
}

// const check = "Sim=89883030000101192190 SOS= APN=bws.br,bws,bws TZ=W0 HB=60,1800 MG=0 TX=180 BJ=0 ACCMODE=1 TDET=0 WKMODE=0 DD=0 OD=0 ZD=7 AC=0,0 SDMS=2 TUR=1 PR=1 DK=1726 JD=48 LBS=* MODE=1 LED=1 IV=1 ACC=1 GPRS:4G E_UTRAN GPS:V PROT=E3+ DC:100,2000 Voltage:13.40,12.90 AF:OFF GS:80";

// const status = "BATTERY EXTERNAL:11.49V;BATT_INT:0%;ACC:ON;GPRS:Ok;GPS:0;GSM:20;HR: ;Buffer Memory:0;Tech:4G E_UTRAN;IP:143.198.247.1;Port:2000;ENGINE MODE1"
